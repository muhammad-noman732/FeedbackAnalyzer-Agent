from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user
from app.dependencies.services import get_analytics_service, get_chat_service
from app.services.analytics_service import AnalyticsService
from app.services.chat_service import ChatService
from app.models.user import UserInDB

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def get_analytics_summary(
    current_user: UserInDB = Depends(get_current_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    user_id = str(current_user.id)
    return analytics_service.get_analytics_summary(user_id)


@router.get("/history")
def get_analytics_history(
    limit: int = 10,
    current_user: UserInDB = Depends(get_current_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    user_id = str(current_user.id)
    return analytics_service.get_historical_analytics(user_id, limit=limit)


@router.get("/themes")
def get_theme_breakdown(
    current_user: UserInDB = Depends(get_current_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    user_id = str(current_user.id)
    return analytics_service.get_theme_breakdown(user_id)


@router.get("/recommendations")
def get_recommendations(
    current_user: UserInDB = Depends(get_current_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    user_id = str(current_user.id)
    return analytics_service.get_recommendations(user_id)


@router.get("/stats")
def get_user_stats(
    current_user: UserInDB = Depends(get_current_user),
    chat_service: ChatService = Depends(get_chat_service),
):
    user_id = str(current_user.id)
    return chat_service.get_user_stats(user_id)
