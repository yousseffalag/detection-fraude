from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, func
from sqlalchemy.orm import relationship
import enum
from src.database import Base


class AlgorithmEnum(str, enum.Enum):
    RANDOM_FOREST = "RandomForest"
    XGBOOST = "XGBoost"
    LOGISTIC_REGRESSION = "LogisticRegression"
    SVM = "SVM"
    NEURAL_NETWORK = "NeuralNetwork"
    LGBM = "LightGBM"
    


class MLModel(Base):
    __tablename__ = "ml_models"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)
    algorithm = Column(Enum(AlgorithmEnum), nullable=False)
    file_path = Column(String, nullable=False)  # chemin vers le .pkl
    trained_on = Column(DateTime(timezone=True), server_default=func.now())

    n_transactions = Column(Integer, nullable=True)
    f1_score = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=True)
    best_threshold = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transactions = relationship("Transaction", back_populates="ml_model")
