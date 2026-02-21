from typing import List, Dict
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, AIMessage
from app.core.config import settings
from app.agents.tools.feedback_tools import create_feedback_tools


SYSTEM_PROMPT = """You are a Senior Product Analyst AI Assistant.

YOUR ROLE:
Answer questions about customer feedback. 
CRITICAL: A conversation can contain BOTH chat messages AND uploaded CSV datasets.
- Chat messages appear in your conversation history.
- CSV data DOES NOT appear in history. You can ONLY see it by calling TOOLS.

AVAILABLE TOOLS:
- get_all_feedbacks: Returns EVERY feedback in this session (Chat + CSV).
- get_negative_feedbacks: Returns only negative feedback (Chat + CSV).
- get_positive_feedbacks: Returns only positive feedback (Chat + CSV).
- get_analytics_summary: Returns statistical breakdown (satisfaction, stats) for the WHOLE session.

RULES:
1. If the user asks "How many...", "What are...", or "Which...", you MUST call a tool. 
2. Do NOT rely on your chat memory for counts or data analysis. Tool results are the FINAL TRUTH.
3. If tool results differ from chat history, the TOOL results are correct because they include the CSV data.
4. Always quote text from the tool output to prove your answers.

FORMAT:
- Use **bold** headers.
- Use bullet points.
- Quote feedback: "This is a quote".
"""


class FeedbackAgent:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self._current_conversation_id: str = None
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=settings.GROQ_API_KEY,
            temperature=0.0,
            max_tokens=4000,
        )
        self._agent = None

    def _get_agent(self, conversation_id: str):
        if self._agent is None or self._current_conversation_id != conversation_id:
            self._current_conversation_id = conversation_id
            tools = create_feedback_tools(self.user_id, conversation_id)
            self._agent = create_react_agent(
                model=self.llm, tools=tools, prompt=SYSTEM_PROMPT
            )
        return self._agent

    def set_conversation_id(self, conversation_id: str):
        self._current_conversation_id = conversation_id
        self._agent = None

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
            # We add a hidden nudge to ensure it doesn't just look at memory
            inputs = {"messages": chat_history + [HumanMessage(content=message)]}
            result = agent.invoke(inputs)

            if isinstance(result, dict) and "messages" in result:
                messages = result["messages"]
            elif isinstance(result, list):
                messages = result
            else:
                messages = [result]

            last_message = messages[-1]
            response_text = (
                last_message.content
                if hasattr(last_message, "content")
                else str(last_message)
            )

            tools_used = []
            for msg in messages:
                if hasattr(msg, "tool_calls") and msg.tool_calls:
                    for tc in msg.tool_calls:
                        tools_used.append(
                            tc.get("name")
                            if isinstance(tc, dict)
                            else getattr(tc, "name", "unknown")
                        )

            return {
                "response": response_text,
                "tools_used": list(set(tools_used)),
                "success": True,
            }

        except Exception as e:
            return {
                "response": "I had trouble scanning the database. Please try again.",
                "tools_used": [],
                "success": False,
                "error": str(e),
            }
