from sqlalchemy import Column, Integer, String, Float, Enum, JSON, ForeignKey, DateTime , func
from sqlalchemy.orm import relationship
from src.database import Base
import enum

class TransactionType(str, enum.Enum):
    CASH_IN = "CASH_IN"
    CASH_OUT = "CASH_OUT"
    PAYMENT = "PAYMENT"
    TRANSFER = "TRANSFER"
    DEBIT = "DEBIT"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(Enum(TransactionType), nullable=False)
    amt = Column(Float, nullable=False)
    nameOrig = Column(String, nullable=False)
    oldbalanceOrg = Column(Float, nullable=False)
    newbalanceOrig = Column(Float, nullable=False)
    nameDest = Column(String, nullable=False)
    oldbalanceDest = Column(Float, nullable=False)
    newbalanceDest = Column(Float, nullable=False)
    isFraud = Column(Integer, nullable=False)
    weekday = Column(Integer, nullable=False)
    hour = Column(Integer, nullable=False)
    minute = Column(Integer, nullable=False)

    probability = Column(Float, nullable=True)  
    influencing_factors = Column(JSON, nullable=True)  

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)  #

    # 🔑 Relation avec User
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  
    user = relationship("User", back_populates="transactions")
