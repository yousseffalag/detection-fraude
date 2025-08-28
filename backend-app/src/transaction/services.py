from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from src.transaction.model import Transaction
from fastapi import Depends
from typing import List
from src.auth.model import User
from src.core.security import get_admin_user
from src.database import get_db


def get_stats(db: Session):
    today = datetime.utcnow()
    current_month = today.month
    current_year = today.year

    # --- Transactions du mois courant ---
    total_current = db.query(func.count()).filter(
        extract("month", Transaction.created_at) == current_month,
        extract("year", Transaction.created_at) == current_year
    ).scalar()

    fraud_current = db.query(func.count()).filter(
        extract("month", Transaction.created_at) == current_month,
        extract("year", Transaction.created_at) == current_year,
        Transaction.isFraud == 1
    ).scalar()

    # --- Transactions du mois précédent ---
    prev_month = current_month - 1 if current_month > 1 else 12
    prev_year = current_year if current_month > 1 else current_year - 1

    total_prev = db.query(func.count()).filter(
        extract("month", Transaction.created_at) == prev_month,
        extract("year", Transaction.created_at) == prev_year
    ).scalar()

    fraud_prev = db.query(func.count()).filter(
        extract("month", Transaction.created_at) == prev_month,
        extract("year", Transaction.created_at) == prev_year,
        Transaction.isFraud == 1
    ).scalar()

    # --- Calculs ---
    fraud_rate_current = (fraud_current / total_current * 100) if total_current > 0 else 0
    fraud_rate_prev = (fraud_prev / total_prev * 100) if total_prev > 0 else 0

    return {
        "total_transactions": {
            "current": total_current,
            "previous": total_prev,
            "evolution_percent": (
                ((total_current - total_prev) / total_prev * 100) if total_prev > 0 else 0
            )
        },
        "suspect_transactions": {
            "current": fraud_current,
            "previous": fraud_prev,
            "evolution_percent": (
                ((fraud_current - fraud_prev) / fraud_prev * 100) if fraud_prev > 0 else 0
            )
        },
        "fraud_rate": {
            "current": fraud_rate_current,
            "previous": fraud_rate_prev,
            "evolution_percent": fraud_rate_current - fraud_rate_prev
        }
    }


def get_all_transactions(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)) -> List[dict]:
    # On récupère toutes les transactions et join avec User
    transactions = db.query(Transaction).join(User).all()

    result = []
    for tx in transactions:
        result.append({
            "id": tx.id,
            "type": tx.type.value if hasattr(tx.type, "value") else tx.type,
            "amt": tx.amt,
            "nameOrig": tx.nameOrig,
            "oldbalanceOrg": tx.oldbalanceOrg,
            "newbalanceOrig": tx.newbalanceOrig,
            "nameDest": tx.nameDest,
            "oldbalanceDest": tx.oldbalanceDest,
            "newbalanceDest": tx.newbalanceDest,
            "isFraud": tx.isFraud,
            "weekday": tx.weekday,
            "hour": tx.hour,
            "minute": tx.minute,
            "probability": tx.probability,
            "influencing_factors": tx.influencing_factors,
            "user": {
                "username": tx.user.username,
                "email": tx.user.email
            }
        })
    return result