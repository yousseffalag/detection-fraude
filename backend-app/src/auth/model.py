from sqlalchemy import Column, Integer, String
from src.database import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True , autoincrement=True , index = True )
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(128), nullable=False)
