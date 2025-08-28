from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.transaction.model import Transaction
from src.auth.model import User, UserRole
from src.transaction.services import get_stats , get_all_transactions
from src.core.security import get_admin_user 

router = APIRouter(prefix="/transactions", tags=["Statistics"])

@router.get("/stats")
def transaction_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    stats = get_stats(db)
    return stats

@router.get("/", summary="Get all transactions (Admin only)")
def list_transactions(transactions = Depends(get_all_transactions)):
    return transactions