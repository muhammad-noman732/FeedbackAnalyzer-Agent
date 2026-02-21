from langchain.tools import tool
from app.core.database import get_database
from bson import ObjectId
import json


def create_feedback_tools(user_id: str, conversation_id: str = None):
    db = get_database()
    feedback_collection = db["feedbacks"]
    analysis_collection = db["analyses"]

    # Always search ALL feedbacks for this user (not scoped to one conversation)
    base_query = {"user_id": ObjectId(user_id)}

    @tool
    def get_all_feedbacks(limit: int = 100) -> str:
        """Get all customer feedback from the database for the current user.
        Returns a JSON string with the list of feedbacks, their sentiments, and themes.
        Use this to get a broad overview of what customers are saying, or to answer
        general questions about the dataset."""
        try:
            feedbacks = list(
                feedback_collection.find(base_query).sort("created_at", -1).limit(limit)
            )

            if not feedbacks:
                return json.dumps(
                    {
                        "status": "no_data",
                        "message": "No feedbacks found. Ask the user to submit some customer feedback first.",
                        "total": 0,
                    }
                )

            formatted = []
            for f in feedbacks:
                formatted.append(
                    {
                        "content": f.get("content", "")[:300],
                        "sentiment": f.get("sentiment", "unknown"),
                        "themes": f.get("themes", []),
                    }
                )

            return json.dumps(
                {
                    "status": "success",
                    "total": len(formatted),
                    "feedbacks": formatted,
                }
            )

        except Exception as e:
            return json.dumps({"status": "error", "message": str(e)})

    @tool
    def get_negative_feedbacks(limit: int = 50) -> str:
        """Get only the purely NEGATIVE feedback (complaints, problems, bugs, crashes).
        Does NOT include mixed feedback (feedback with both positive and negative aspects).
        Use this when the user asks: what are the complaints, what is bad, what are the problems,
        what are the worst reviews, what should be fixed."""
        try:
            query = {**base_query, "sentiment": "negative"}
            feedbacks = list(
                feedback_collection.find(query).sort("created_at", -1).limit(limit)
            )

            if not feedbacks:
                return json.dumps(
                    {
                        "status": "success",
                        "total": 0,
                        "message": "No purely negative feedbacks found.",
                        "feedbacks": [],
                    }
                )

            formatted = [
                {
                    "content": f.get("content", ""),
                    "themes": f.get("themes", []),
                }
                for f in feedbacks
            ]

            return json.dumps(
                {
                    "status": "success",
                    "total": len(formatted),
                    "feedbacks": formatted,
                }
            )

        except Exception as e:
            return json.dumps({"status": "error", "message": str(e)})

    @tool
    def get_positive_feedbacks(limit: int = 50) -> str:
        """Get only the purely POSITIVE feedback (praise, compliments, satisfaction).
        Does NOT include mixed feedback.
        Use this when the user asks: what is good, what are the strengths, what do customers like,
        what are the best reviews, what is working well."""
        try:
            query = {**base_query, "sentiment": "positive"}
            feedbacks = list(
                feedback_collection.find(query).sort("created_at", -1).limit(limit)
            )

            # If no positive-tagged documents found, fall back to analytics summary
            if not feedbacks:
                latest = analysis_collection.find_one(
                    {"user_id": ObjectId(user_id)}, sort=[("created_at", -1)]
                )
                if latest:
                    analysis = latest.get("analysis", {})
                    dist = analysis.get("sentiment_distribution", {})
                    pos_count = dist.get("positive", 0)
                    total = analysis.get("total_feedbacks_analyzed", 0)
                    if pos_count > 0:
                        return json.dumps(
                            {
                                "status": "success",
                                "note": "Count from AI analysis. Individual feedback texts not separately stored as positive.",
                                "total_positive": pos_count,
                                "total_analyzed": total,
                                "positive_percentage": round(pos_count / total * 100)
                                if total
                                else 0,
                                "feedbacks": [],
                            }
                        )
                return json.dumps(
                    {
                        "status": "success",
                        "total": 0,
                        "message": "No purely positive feedbacks found in the current dataset.",
                        "feedbacks": [],
                    }
                )

            formatted = [
                {"content": f.get("content", ""), "themes": f.get("themes", [])}
                for f in feedbacks
            ]

            return json.dumps(
                {
                    "status": "success",
                    "total": len(formatted),
                    "feedbacks": formatted,
                }
            )

        except Exception as e:
            return json.dumps({"status": "error", "message": str(e)})

    @tool
    def get_mixed_feedbacks(limit: int = 50) -> str:
        """Get MIXED feedback — reviews that contain BOTH positive and negative aspects.
        Examples: 'I love the design but the app keeps crashing', 'Great service but slow delivery'.
        Use this when the user asks about bittersweet feedback, or feedback that has both praise and complaints."""
        try:
            query = {**base_query, "sentiment": "mixed"}
            feedbacks = list(
                feedback_collection.find(query).sort("created_at", -1).limit(limit)
            )

            formatted = [
                {"content": f.get("content", ""), "themes": f.get("themes", [])}
                for f in feedbacks
            ]

            return json.dumps(
                {
                    "status": "success",
                    "total": len(formatted),
                    "feedbacks": formatted,
                }
            )

        except Exception as e:
            return json.dumps({"status": "error", "message": str(e)})

    @tool
    def get_analytics_summary() -> str:
        """Get the overall analytics summary including satisfaction score, sentiment distribution, and top themes.
        Returns a JSON string with aggregated statistics from the latest AI analysis.
        Use this when the user asks for: a summary, overall status, satisfaction rate, general metrics,
        how many positive/negative/neutral feedbacks there are, or overall performance."""
        try:
            latest = analysis_collection.find_one(
                {"user_id": ObjectId(user_id)}, sort=[("created_at", -1)]
            )

            if not latest:
                return json.dumps(
                    {
                        "status": "no_data",
                        "message": "No analysis found. No feedback has been analyzed yet.",
                    }
                )

            analysis = latest.get("analysis", {})

            return json.dumps(
                {
                    "status": "success",
                    "satisfaction_index": int(
                        analysis.get("satisfaction_index", 0) * 100
                    ),
                    "overall_sentiment": analysis.get("overall_sentiment", "unknown"),
                    "total_feedbacks": analysis.get("total_feedbacks_analyzed", 0),
                    "sentiment_distribution": analysis.get(
                        "sentiment_distribution", {}
                    ),
                    "top_themes": [
                        {
                            "theme": t.get("theme"),
                            "count": t.get("count"),
                            "sentiment": t.get("sentiment"),
                        }
                        for t in analysis.get("themes", [])[:10]
                    ],
                    "chat_response": analysis.get("chat_response", ""),
                }
            )

        except Exception as e:
            return json.dumps({"status": "error", "message": str(e)})

    @tool
    def get_theme_analysis(theme_name: str = None) -> str:
        """Get a breakdown of feedback grouped by theme or topic.
        Optionally filter by a specific theme name. Returns theme counts and related feedback.
        Use this when the user asks about specific topics, categories, or patterns in the feedback."""
        try:
            query = dict(base_query)

            if theme_name:
                query["themes"] = {"$in": [theme_name.lower()]}

            feedbacks = list(feedback_collection.find(query).limit(200))

            theme_counts = {}
            for fb in feedbacks:
                for theme in fb.get("themes", []):
                    theme_counts[theme] = theme_counts.get(theme, 0) + 1

            sorted_themes = sorted(
                theme_counts.items(), key=lambda x: x[1], reverse=True
            )

            return json.dumps(
                {
                    "status": "success",
                    "total_feedbacks": len(feedbacks),
                    "themes": [{"theme": t, "count": c} for t, c in sorted_themes[:20]],
                }
            )

        except Exception as e:
            return json.dumps({"status": "error", "message": str(e)})

    @tool
    def get_feature_suggestions() -> str:
        """Get prioritized feature suggestions and recommended improvements from the latest analysis.
        Returns suggestions grouped by priority: critical, high, medium, low.
        Use this when the user asks: what to improve, what to fix, what to build, what actions to take,
        what are the recommendations, what should be prioritized."""
        try:
            latest = analysis_collection.find_one(
                {"user_id": ObjectId(user_id)}, sort=[("created_at", -1)]
            )

            if not latest:
                return json.dumps(
                    {
                        "status": "no_data",
                        "message": "No suggestions available yet.",
                    }
                )

            analysis = latest.get("analysis", {})
            suggestions = analysis.get("feature_suggestions", [])

            grouped = {"critical": [], "high": [], "medium": [], "low": []}

            for s in suggestions:
                priority = s.get("priority", "medium").lower()
                if priority in grouped:
                    grouped[priority].append(
                        {
                            "feature": s.get("feature"),
                            "reasoning": s.get("reasoning"),
                            "affected_users": s.get("affected_users", 0),
                        }
                    )

            return json.dumps({"status": "success", "prioritized_features": grouped})

        except Exception as e:
            return json.dumps({"status": "error", "message": str(e)})

    return [
        get_all_feedbacks,
        get_negative_feedbacks,
        get_positive_feedbacks,
        get_mixed_feedbacks,
        get_analytics_summary,
        get_theme_analysis,
        get_feature_suggestions,
    ]
