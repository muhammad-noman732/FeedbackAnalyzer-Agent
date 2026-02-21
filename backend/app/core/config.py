from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    MONGODB_URL: str = os.getenv("MONGODB_URL")
    DATABASE_NAME: str = "feedback_app"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    class Config:
        env_file = ".env"
        extra = "ignore"
settings = Settings()
