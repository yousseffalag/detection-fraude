from pydantic import BaseModel
from typing import Optional
from src.transaction.model import TransactionType

class TransactionPredictionRequest(BaseModel):
    type: TransactionType
    amt: float
    nameOrig: str
    oldbalanceOrg: float
    newbalanceOrig: float
    nameDest: str
    oldbalanceDest: float
    newbalanceDest: float
    weekday: int
    hour: int
    ml_model_id: int  # l'utilisateur choisit quel modèle utiliser
    

class TransactionPredictionResponse(BaseModel):
    prediction: int
    probability: float
    influencing_factors: Optional[dict] = None

class BatchPredictionResponse(BaseModel):
    transactions: list[TransactionPredictionResponse]
    stats: dict

