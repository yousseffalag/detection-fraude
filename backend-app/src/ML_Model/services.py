import os
from sqlalchemy.orm import Session
from fastapi import UploadFile,HTTPException
from sqlalchemy import func
import numpy as np
from src.utils.preprocessing import FraudRateEncoder, FeatureEngineer
from . import models, schemas
from src.utils.file_manager import save_upload_file
import pandas as pd
from .loader import load_model
import joblib
from sklearn.metrics import f1_score, precision_score, recall_score, accuracy_score, fbeta_score, confusion_matrix, classification_report
from lightgbm import LGBMClassifier
from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

def create_ml_model(db: Session, model_data: schemas.MLModelCreate, file: UploadFile):
 
    # 1️⃣ Sauvegarde du fichier uploadé
    file_path = save_upload_file(file, "ml_models")
    
    # 2️⃣ Création de l'objet DB
    db_model = models.MLModel(
        name=model_data.name,
        algorithm=model_data.algorithm,
        n_transactions=model_data.n_transactions,
        file_path=file_path,
    )
    db.add(db_model)
    db.commit()
    db.refresh(db_model)

    # Colonnes utilisées par le modèle
    final_columns_selected = [
        'hour_of_day', 'day_of_week', 'oldbalanceOrg', 'newbalanceOrig',
        'oldbalanceDest', 'newbalanceDest',
        'diff_new_old_balance', 'diff_new_old_destiny',
        'type','ratio_amount_balanceOrig'
    ]

    try:
        # 3️⃣ Chargement du modèle
        model = joblib.load(file_path)

        # 4️⃣ Chargement du dataset de test
        X_test = pd.read_csv("data/X_test_raw.csv")
        y_true = pd.read_csv("data/y_test_raw.csv").iloc[:,0].astype(int).values

        X_test_cs = X_test[final_columns_selected]

        # 6️⃣ Prédictions et seuil
        y_scores = model.predict_proba(X_test_cs)[:, 1]
        best_threshold = 0.5
        y_pred_final = (y_scores >= best_threshold).astype(int)

        # 7️⃣ Calcul métriques directement à partir du modèle
        f1 = f1_score(y_true, y_pred_final)
        precision = precision_score(y_true, y_pred_final)
        recall = recall_score(y_true, y_pred_final)
        accuracy = accuracy_score(y_true, y_pred_final)

        # 8️⃣ Stockage des métriques dans la DB
        db_model.f1_score = float(np.round(f1, 6))
        db_model.precision = float(np.round(precision, 6))
        db_model.recall = float(np.round(recall, 6))
        db_model.accuracy = float(np.round(accuracy, 6))
        db_model.best_threshold = float(best_threshold)
        db.commit()
        db.refresh(db_model)

        # 9️⃣ Debug : matrice de confusion
        print("Matrice de confusion :\n", confusion_matrix(y_true, y_pred_final))
        print(classification_report(y_true, y_pred_final, digits=4, zero_division=0))

        # 1️⃣0️⃣ Résultat API calculé à nouveau à partir du modèle
        result_api = {
            "id": db_model.id,
            "name": db_model.name,
            "algorithm": db_model.algorithm,
            "n_transactions": db_model.n_transactions,
            "file_path": db_model.file_path,
            "trained_on": db_model.trained_on,
            "f1_score": float(np.round(f1, 6)),
            "precision": float(np.round(precision, 6)),
            "recall": float(np.round(recall, 6)),
            "accuracy": float(np.round(accuracy, 6)),
            "best_threshold": float(best_threshold),
            "created_at": db_model.created_at
        }

        return result_api


    except Exception as e:
        db.rollback()
        # Lever une exception HTTP pour FastAPI
        raise HTTPException(status_code=400, detail=f"Erreur lors de l'évaluation du modèle: {e}")


def list_ml_models(db: Session):
    return db.query(models.MLModel).all()


def update_ml_model(db: Session, model_id: int, update_data: schemas.MLModelUpdate):
    db_model = db.query(models.MLModel).filter(models.MLModel.id == model_id).first()
    if not db_model:
        return None

    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(db_model, key, value)

    db.commit()
    db.refresh(db_model)
    return db_model


def get_ml_models_stats(db: Session):
    stats = db.query(
        func.avg(models.MLModel.accuracy).label("avg_accuracy"),
        func.avg(models.MLModel.precision).label("avg_precision"),
        func.avg(models.MLModel.recall).label("avg_recall"),
        func.avg(models.MLModel.f1_score).label("avg_f1_score"),
        func.count(models.MLModel.id).label("n_models")
    ).first()

    return {
        "n_models": stats.n_models,
        "avg_accuracy": float(stats.avg_accuracy) if stats.avg_accuracy is not None else 0.0,
        "avg_precision": float(stats.avg_precision) if stats.avg_precision is not None else 0.0,
        "avg_recall": float(stats.avg_recall) if stats.avg_recall is not None else 0.0,
        "avg_f1_score": float(stats.avg_f1_score) if stats.avg_f1_score is not None else 0.0,
    }
