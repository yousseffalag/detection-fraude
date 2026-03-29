from fastapi import APIRouter, Depends, HTTPException,  UploadFile, File, Query
from sqlalchemy.orm import Session
from src.database import get_db
from src.transaction.model import Transaction,TransactionType
from src.auth.model import User, UserRole
from src.transaction.services import get_stats , get_all_transactions ,get_transaction_stats, predict_transactions_batch,get_all_transactions_for_specific_user, predict_transaction_service,get_stats_user,get_user_transaction_stats
from src.core.security import get_admin_user , get_current_user
from . import schemas, services,model
import pandas as pd
from src.ML_Model.loader import load_model
from src.ML_Model.models import MLModel
import traceback
from typing import Optional

router = APIRouter(prefix="/transactions", tags=["Statistics"])

@router.get("/stats")
def transaction_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    stats = get_stats(db)
    return stats



@router.get("/", summary="Get all transactions (Admin only)")
def list_transactions(
    status: Optional[str] = Query(None, description="Filter by status: completed, failed, accepted, rejected"),
    risk: Optional[str] = Query(None, description="Filter by risk: faible, modéré, élevé"),
    page: int = Query(1, ge=1, description="Page number"),
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    return get_all_transactions(db=db, status=status, risk=risk, page=page, page_size=6)



@router.get("/user", summary="Get transactions for the logged-in user")
def user_transactions(
    status: Optional[str] = Query(None, description="Filtre: completed, failed, accepted, rejected"),
    risk: Optional[str] = Query(None, description="Filtre: low, medium, high"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # doit renvoyer l'utilisateur connecté
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Utilisateur non authentifié")

    stats = get_all_transactions_for_specific_user(
        db=db,
        current_user_id=current_user.id,
        status=status,
        risk=risk,
        page=page,
        page_size=page_size
    )
    return stats


@router.get("/stats/user", summary="Get stats for the logged-in user")
def user_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    stats = get_stats_user(db=db, user_id=current_user.id)
    return stats


@router.post("/predict", response_model=schemas.TransactionPredictionResponse)
def predict_transaction(data: schemas.TransactionPredictionRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return predict_transaction_service(db=db, data=data, user_id=current_user.id)


@router.get("/stats/yearly", summary="Get yearly transaction statistics")
def yearly_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return get_transaction_stats(db)


@router.get("/user/stats")
def user_transaction_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # doit renvoyer un dict ou objet avec 'id'
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Utilisateur non authentifié")
    
    stats = get_user_transaction_stats(db, user_id=current_user.id)
    return stats



@router.post("/predict-batch", response_model=schemas.BatchPredictionResponse)
async def batch_predict(
    ml_model_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1️⃣ Vérifier le type de fichier
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Seul les fichiers CSV sont acceptés.")

    # 2️⃣ Lire le CSV
    try:
        df = pd.read_csv(file.file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur lecture CSV: {e}")

    # 3️⃣ Prédictions batch avec capture d'erreurs
    try:
        result = predict_transactions_batch(
            db=db,
            user_id=current_user.id,
            ml_model_id=ml_model_id,
            df=df
        )
    except Exception as e:
        print("Erreur predict_transactions_batch:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur interne: {e}")

    return result