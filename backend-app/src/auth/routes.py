from fastapi import APIRouter, Depends,HTTPException, status
from src.auth.schemas import Token, UserCreate,UserLogin
from src.auth.services import register_user, authenticate_user
from src.core.security import create_jwt_token,get_current_user,verify_email_token,create_email_verification_token,get_verified_user
from src.database import get_db
from sqlalchemy.orm import Session
from src.auth.model import User
from src.utils.email_utils import send_verification_email
from sqlalchemy.exc import IntegrityError


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    
    try:

        new_user = register_user(db, user.username, user.email, user.password, user.confirm_password)
        
        # Create email verification token
        token = create_email_verification_token(user.email)

        # Send email (Mailtrap)
        await send_verification_email(user.email, user.username, token)

        return {
            "message": "User registered successfully",
            "user": {
                "username": new_user.username,
                "email": new_user.email
            }
        }
    
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists"
        )
    


@router.post("/login",response_model = Token )
async def login(userInfo : UserLogin , db: Session = Depends(get_db)):
    user = authenticate_user(db, userInfo.email, userInfo.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_verified:
        
        token = create_email_verification_token(user.email)
        await send_verification_email(user.email, user.username, token)

        # If the user is not verified, raise an exception
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_jwt_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_verified_user)):
    return {
        "username": current_user.username,
        "email": current_user.email
    }


@router.get("/verify-email")
async def verify_email(token: str,db: Session = Depends(get_db)):

    email = verify_email_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_verified = True
    db.commit()
    db.refresh(user)
   
    return {"message": f"Email {email} verified successfully"}


