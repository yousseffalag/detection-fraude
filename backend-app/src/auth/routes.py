from fastapi import APIRouter, Depends,HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from src.auth.schemas import Token, UserCreate,UserLogin
from src.auth.services import register_user, authenticate_user
from src.core.security import create_jwt_token,get_current_user
from src.database import get_db
from sqlalchemy.orm import Session
from src.auth.model import User


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    new_user = register_user(db, user.username, user.email, user.password, user.confirm_password)
    return {
        "message": "User registered successfully",
        "user": {
            "username": new_user.username,
            "email": new_user.email
        }
    }


@router.post("/login",response_model = Token )
def login(userInfo : UserLogin , db: Session = Depends(get_db)):
    user = authenticate_user(db, userInfo.email, userInfo.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_jwt_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email
    }


