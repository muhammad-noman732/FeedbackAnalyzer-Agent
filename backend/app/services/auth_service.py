from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import UserInDB
from app.schemas.user import UserSignup, UserLogin, Token, UserResponse

class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    def signup(self, user_data: UserSignup) -> UserResponse:
        existing_user = self.user_repository.find_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        user = UserInDB(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
        )
        created_user = self.user_repository.create_user(user)
        return UserResponse(
            id=str(created_user.id),
            first_name=created_user.first_name,
            last_name=created_user.last_name,
            email=created_user.email,
            created_at=created_user.created_at.isoformat(),
        )
    def login(self, credentials: UserLogin) -> Token:
        user = self.user_repository.find_by_email(credentials.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        if not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        access_token = create_access_token(
            data={"sub": user.email, "user_id": str(user.id)}
        )
        return Token(access_token=access_token)
