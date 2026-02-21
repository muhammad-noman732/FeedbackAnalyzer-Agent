from typing import List, Dict
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, AIMessage
from app.core.config import settings
from app.agents.tools.feedback_tools import create_feedback_tools


SYSTEM_PROMPT = """You are a Senior Product Analyst AI Assistant.

YOUR ROLE:
Answer the user's questions about the customer feedback data that was JUST ANALYZED in this conversation.
Only look at feedback from the current session — do not mix in data from other sessions.

AVAILABLE TOOLS AND WHEN TO USE THEM:
- get_all_feedbacks: Use for GENERAL questions, or when you need full context of all feedback in this session
- get_negative_feedbacks: Use ONLY when asked about complaints, problems, bad reviews, what's wrong, what to fix
- get_positive_feedbacks: Use ONLY when asked about praise, strengths, good reviews, what customers like
- get_mixed_feedbacks: Use when asked about bittersweet feedback (both praise AND complaints in same review)
- get_analytics_summary: Use for overall metrics, satisfaction score, sentiment breakdown, general summary
- get_theme_analysis: Use for questions about specific topics, features, or recurring patterns
- get_feature_suggestions: Use for improvement recommendations, what to build/fix, priority actions

CRITICAL RULES FOR ACCURATE RESPONSES:
1. SENTIMENT CATEGORIES:
   - "positive" = ONLY praise, no negatives at all
   - "negative" = ONLY complaints/problems, no positives
   - "mixed" = has BOTH positive AND negative parts in the same review
   - "neutral" = no clear opinion either way
2. "What are the good feedbacks?" → call get_positive_feedbacks (EXCLUDES mixed)
3. "What are the bad feedbacks?" → call get_negative_feedbacks (EXCLUDES mixed)
4. "What are the mixed feedbacks?" → call get_mixed_feedbacks
5. ALWAYS use exact counts from tool results. Never invent numbers.
6. If the tool returns 0 results, say so honestly.
7. Quote real text from the feedback data in your response.

RESPONSE FORMAT:
- Use **bold** headers and bullet points
- Quote real feedback text using "quotation marks"
- State exact numbers from tool results
- Be concise and actionable"""


class FeedbackAgent:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self._current_conversation_id: str = None
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=settings.GROQ_API_KEY,
            temperature=0.1,
            max_tokens=4000,
        )
        # Agent is built lazily on first call with a conversation_id
        self._agent = None

    def _get_agent(self, conversation_id: str):
        """Return agent scoped to conversation_id, rebuilding only when it changes."""
        if self._agent is None or self._current_conversation_id != conversation_id:
            self._current_conversation_id = conversation_id
            tools = create_feedback_tools(self.user_id, conversation_id)
            self._agent = create_react_agent(
                model=self.llm, tools=tools, prompt=SYSTEM_PROMPT
            )
        return self._agent

    # Legacy compatibility — kept so old callers don't crash
    def set_conversation_id(self, conversation_id: str):
        self._current_conversation_id = conversation_id
        self._agent = None  # force rebuild on next call

    def chat(
        self, message: str, history: List[Dict] = [], conversation_id: str = None
    ) -> Dict:
        agent = self._get_agent(conversation_id or self._current_conversation_id)

        chat_history = []
        for msg in history[-10:]:
            role = msg.get("role")
            content = msg.get("content", "")
            if role == "user":
                chat_history.append(HumanMessage(content=content))
            elif role in ["assistant", "agent"]:
                chat_history.append(AIMessage(content=content))

        try:
            inputs = {"messages": chat_history + [HumanMessage(content=message)]}
            result = agent.invoke(inputs)

            if isinstance(result, dict) and "messages" in result:
                messages = result["messages"]
            elif isinstance(result, list):
                messages = result
            else:
                raise ValueError(f"Unexpected result type: {type(result)}")

            last_message = messages[-1]
            if hasattr(last_message, "content"):
                response_text = last_message.content
            elif isinstance(last_message, dict) and "content" in last_message:
                response_text = last_message["content"]
            else:
                response_text = str(last_message)

            tools_used = []
            for msg in messages:
                if hasattr(msg, "tool_calls") and msg.tool_calls:
                    for tc in msg.tool_calls:
                        tools_used.append(tc["name"])
                elif isinstance(msg, dict) and "tool_calls" in msg:
                    for tc in msg["tool_calls"]:
                        tools_used.append(tc.get("name", "unknown"))

            return {
                "response": response_text,
                "tools_used": list(set(tools_used)),
                "success": True,
            }

        except Exception as e:
            import traceback

            traceback.print_exc()
            error_str = str(e).lower()
            if (
                "timeout" in error_str
                or "connection" in error_str
                or "rate" in error_str
            ):
                friendly_msg = (
                    "I'm experiencing high demand. Please wait a moment and try again."
                )
            else:
                friendly_msg = (
                    "I had trouble processing your question. "
                    "Try rephrasing, or ask: 'What are the main complaints?', "
                    "'Show satisfaction score', or 'What should I fix first?'"
                )
            return {
                "response": friendly_msg,
                "tools_used": [],
                "success": True,
                "error": str(e),
            }
