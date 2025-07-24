from sqlalchemy.orm import Session
from src.auth.model import User
from src.core.security import verify_password, hash_password
from fastapi import HTTPException,Depends
from src.database import get_db 

def authenticate_user(db : Session = Depends(get_db), email: str = None, password: str = None) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user is None or not verify_password(password,user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user

def register_user(db : Session = Depends(get_db), username : str = None, email : str = None , password : str = None , confirm_password : str = None) -> User :
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if db.query(User).filter(User.email == email).first() :
        raise HTTPException(status_code = 400,  detail="Email already registered")
    hashed_password = hash_password(password)
    new_user = User(username = username , email = email, password = hashed_password)
    db.add(new_user)
    db.commit()
    return new_user

