from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Dict, Optional
from pydantic import BaseModel
import csv
import io
from app.dependencies.auth import get_current_user
from app.dependencies.services import get_chat_service
from app.services.chat_service import ChatService
from app.models.user import UserInDB

router = APIRouter(prefix="/analyze", tags=["Feedback Analysis"])


class TextAnalysisRequest(BaseModel):
    reviews: List[str]
    history: Optional[List[Dict[str, str]]] = []


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class QuickSentimentRequest(BaseModel):
    text: str


@router.post("/text")
async def analyze_text(
    request: TextAnalysisRequest,
    current_user: UserInDB = Depends(get_current_user),
    chat_service: ChatService = Depends(get_chat_service),
):
    if not request.reviews or len(request.reviews) == 0:
        raise HTTPException(status_code=400, detail="No reviews provided")
    try:
        analysis = chat_service.analyze_reviews(
            reviews=request.reviews,
            history=request.history,
            user_id=str(current_user.id),
        )
        return analysis.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/chat")
async def chat_analyze(
    request: ChatRequest,
    current_user: UserInDB = Depends(get_current_user),
    chat_service: ChatService = Depends(get_chat_service),
):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        result = await chat_service.process_message(
            user_id=str(current_user.id),
            message=request.message,
            conversation_id=request.conversation_id,
        )
        return {
            "conversation_id": result["conversation_id"],
            "response": result["response"],
            "analysis": result.get("analysis"),
            "is_question": result.get("is_question", False),
        }
    except Exception as e:
        # Never let the frontend show a network error for questions/chat
        # Return a graceful response instead of a 500
        import traceback

        traceback.print_exc()
        return {
            "conversation_id": request.conversation_id or "error",
            "response": (
                "I had trouble processing that request. "
                "Please try rephrasing your question, or ask something like: "
                "'What are the main complaints?' or 'Show me satisfaction score'."
            ),
            "analysis": None,
            "is_question": True,
        }


@router.post("/upload")
async def upload_csv(
    file: UploadFile = File(...),
    conversation_id: Optional[str] = Form(None),
    current_user: UserInDB = Depends(get_current_user),
    chat_service: ChatService = Depends(get_chat_service),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    try:
        content = await file.read()
        decoded = content.decode("utf-8")
        reader = csv.DictReader(io.StringIO(decoded))
        feedback_columns = [
            "review",
            "feedback",
            "text",
            "comment",
            "description",
            "content",
            "message",
        ]
        reviews = []
        for row in reader:
            for col in feedback_columns:
                for key in row.keys():
                    if col.lower() in key.lower():
                        text = row[key].strip()
                        if text and len(text) > 10:
                            reviews.append(text)
                        break
        if not reviews:
            reader = csv.DictReader(io.StringIO(decoded))
            for row in reader:
                for value in row.values():
                    if isinstance(value, str) and len(value) > 20:
                        reviews.append(value.strip())
                        break
        if not reviews:
            raise HTTPException(
                status_code=400,
                detail="No valid feedback found in CSV. Ensure it has a column like 'review', 'feedback', or 'text'.",
            )

        analysis = await chat_service.process_csv_upload(
            user_id=str(current_user.id),
            feedbacks=reviews,
            filename=file.filename,
            conversation_id=conversation_id,
        )
        return analysis
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400, detail="Invalid file encoding. Please use UTF-8."
        )
    except csv.Error as e:
        raise HTTPException(status_code=400, detail=f"CSV parsing error: {str(e)}")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Upload processing failed: {str(e)}"
        )


@router.get("/quick-sentiment")
async def quick_sentiment(
    text: str, current_user: UserInDB = Depends(get_current_user)
):

    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    text_lower = text.lower()
    positive_words = [
        "good",
        "great",
        "excellent",
        "love",
        "amazing",
        "best",
        "perfect",
        "wonderful",
        "clean",
        "easy",
        "smooth",
        "fast",
        "speed",
        "smoothly",
    ]
    negative_words = [
        "bad",
        "terrible",
        "slow",
        "worst",
        "hate",
        "poor",
        "broken",
        "crash",
        "disappointed",
        "issue",
        "bug",
        "problem",
        "expensive",
        "battery",
    ]
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    if pos_count > neg_count:
        sentiment = "positive"
        confidence = min(0.9, 0.5 + (pos_count * 0.1))
    elif neg_count > pos_count:
        sentiment = "negative"
        confidence = min(0.9, 0.5 + (neg_count * 0.1))
    else:
        sentiment = "neutral"
        confidence = 0.5
    return {
        "text": text[:100] + "..." if len(text) > 100 else text,
        "sentiment": sentiment,
        "confidence": confidence,
    }
