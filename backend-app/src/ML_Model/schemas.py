from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .models import AlgorithmEnum
from typing import Optional


class MLModelBase(BaseModel):
    name: str
    algorithm: AlgorithmEnum
    n_transactions: Optional[int] = 0


class MLModelCreate(MLModelBase):
    pass  # file upload sera traité à part


class MLModelUpdate(BaseModel):
    f1_score: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    accuracy: Optional[float] = None
    n_transactions: Optional[int] = None
    additional_info: Optional[str] = None

class MLModelResponse(BaseModel):
    id: int
    name: str
    algorithm: str
    n_transactions: Optional[int]
    file_path: str
    trained_on: Optional[datetime]
    f1_score: Optional[float]
    precision: Optional[float]
    recall: Optional[float]
    accuracy: Optional[float]
    best_threshold: Optional[float]
    created_at: datetime

    class Config:
        orm_mode = True
