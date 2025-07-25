from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
from src.database import get_db
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from src.auth.model import User


# Load environment variables
load_dotenv()

# Define the OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")

# function to hash a password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# function to verify the password with the hashed password
def verify_password(plain_password :str , hashed_password : str) -> bool:
    return pwd_context.verify(plain_password,hashed_password)

# function to create a JWT token
def create_jwt_token(data : dict , expires_delta = None) -> str : 
    pypload = data.copy()
    pypload.update({"exp": datetime.utcnow() + timedelta(minutes=expires_delta or int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15)))
})
    return jwt.encode(pypload,os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))

# function to decode a JWT token
def decode_jwt_token(token: str) -> dict:
    try : 
        return jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
    except jwt.JWTError:
        return None
    

def get_current_user(db : Session = Depends(get_db),token : str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_jwt_token(token)
    if payload is None:
        raise credentials_exception
    user = db.query(User).filter(User.username == payload.get("sub")).first()
    if user is None:
        raise credentials_exception

    return user



def create_email_verification_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=1)
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))



def verify_email_token(token: str):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])  

        if payload.get("exp") < datetime.utcnow().timestamp():
            return None

        return payload.get("sub")
    
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    

def get_verified_user(user: User = Depends(get_current_user)):
    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Email not verified"
        )
    return user