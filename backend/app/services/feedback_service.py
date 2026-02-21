from typing import List, Dict, Any
from app.services.ai_service import ai_service, AIService
from app.repositories.feedback_repository import FeedbackRepository
from app.models.feedback import FeedbackAnalysis


class FeedbackService:
    def __init__(self, feedback_repo: FeedbackRepository):
        self.feedback_repo = feedback_repo
        self.ai_service: AIService = ai_service

    async def process_message(
        self, user_id: str, message: str, conversation_id: str = None
    ) -> Dict[str, Any]:
        if not conversation_id:
            conversation = self.feedback_repo.create_conversation(
                user_id=user_id, title="Feedback Analysis"
            )
            conversation_id = str(conversation["_id"])
        self.feedback_repo.create_message(
            conversation_id=conversation_id, role="user", content=message
        )
        messages = self.feedback_repo.get_conversation_messages(
            conversation_id, limit=10
        )
        history = [{"role": msg["role"], "content": msg["content"]} for msg in messages]
        is_question = self.ai_service.is_question(message)
        if is_question:
            response = await self._answer_question(
                user_id=user_id,
                question=message,
                conversation_id=conversation_id,
                history=history,
            )
        else:
            response = await self._analyze_new_feedback(
                user_id=user_id,
                feedback_text=message,
                conversation_id=conversation_id,
                history=history,
            )
        self.feedback_repo.create_message(
            conversation_id=conversation_id,
            role="assistant",
            content=response["chat_response"],
            metadata=response.get("analysis"),
        )
        return {
            "conversation_id": conversation_id,
            "response": response["chat_response"],
            "analysis": response.get("analysis"),
        }

    async def _analyze_new_feedback(
        self,
        user_id: str,
        feedback_text: str,
        conversation_id: str,
        history: List[Dict[str, str]],
    ) -> Dict[str, Any]:
        analysis: FeedbackAnalysis = self.ai_service.analyze_feedback(
            reviews=[feedback_text], history=history
        )
        self.feedback_repo.create_feedback(
            user_id=user_id,
            content=feedback_text,
            sentiment=analysis.overall_sentiment,
            sentiment_score=analysis.satisfaction_index,
            themes=[theme.theme for theme in analysis.themes],
            conversation_id=conversation_id,
        )
        self.feedback_repo.save_analysis(
            user_id=user_id,
            analysis=analysis,
            feedback_count=1,
            conversation_id=conversation_id,
        )
        return {
            "chat_response": analysis.chat_response,
            "analysis": self._analysis_to_dict(analysis),
        }

    async def _answer_question(
        self,
        user_id: str,
        question: str,
        conversation_id: str,
        history: List[Dict[str, str]],
    ) -> Dict[str, Any]:
        feedbacks = self.feedback_repo.get_user_feedbacks(user_id)
        if not feedbacks:
            return {
                "chat_response": "No feedback data available. Submit feedback to start.",
                "analysis": None,
            }
        analysis: FeedbackAnalysis = self.ai_service.analyze_feedback(
            reviews=[f["content"] for f in feedbacks],
            history=history,
            user_question=question,
        )
        return {
            "chat_response": analysis.chat_response,
            "analysis": self._analysis_to_dict(analysis),
        }

    def analyze_reviews(
        self,
        reviews: List[str],
        history: List[Dict[str, str]] = None,
        user_id: str = None,
    ) -> FeedbackAnalysis:
        analysis = self.ai_service.analyze_feedback(
            reviews=reviews, history=history or []
        )
        if user_id:
            self.feedback_repo.save_analysis(
                user_id=user_id, analysis=analysis, feedback_count=len(reviews)
            )
            for review in reviews:
                self.feedback_repo.create_feedback(
                    user_id=user_id,
                    content=review,
                    sentiment=analysis.overall_sentiment,
                    sentiment_score=analysis.satisfaction_index,
                    themes=[t.theme for t in analysis.themes],
                )
        return analysis

    def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        return {
            "sentiment_distribution": self.feedback_repo.get_sentiment_stats(user_id),
            "top_themes": self.feedback_repo.get_theme_stats(user_id),
            "total_feedbacks": self.feedback_repo.get_feedback_count(user_id),
            "average_satisfaction": self.feedback_repo.get_average_satisfaction(
                user_id
            ),
        }

    def _analysis_to_dict(self, analysis: FeedbackAnalysis) -> Dict[str, Any]:
        return (
            analysis.model_dump()
            if hasattr(analysis, "model_dump")
            else analysis.dict()
        )
