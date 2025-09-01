from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from . import schemas, services
from src.core.security import get_admin_user , get_current_user
from src.auth.model import User

router = APIRouter(prefix="/ml-models", tags=["ML Models"])

@router.post("/", response_model=schemas.MLModelResponse)
def upload_model(
    name: str = Form(...),
    algorithm: schemas.AlgorithmEnum = Form(...),
    n_transactions: int = Form(0),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    model_data = schemas.MLModelCreate(name=name, algorithm=algorithm, n_transactions=n_transactions)
    try:
        return services.create_ml_model(db, model_data, file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating model: {e}")
    

    
@router.get("/", response_model=List[schemas.MLModelResponse])
def get_all_models(db: Session = Depends(get_db),  current_user: User = Depends(get_current_user)):
    return services.list_ml_models(db)

@router.put("/{model_id}", response_model=schemas.MLModelResponse)
def update_model(
    model_id: int,
    update_data: schemas.MLModelUpdate,
    db: Session = Depends(get_db)
):
    model = services.update_ml_model(db, model_id, update_data)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

@router.get("/stats", summary="Get average stats for ML models")
def ml_models_stats(db: Session = Depends(get_db) , current_user: User = Depends(get_admin_user)):
    return services.get_ml_models_stats(db)
