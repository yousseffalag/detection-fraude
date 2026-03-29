import os
from sqlalchemy.orm import Session
from fastapi import UploadFile,HTTPException
from sqlalchemy import func
import numpy as np
from src.utils.preprocessing import FeatureEngineer
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
    
    # 2️⃣ Ajout du modèle dans la DB
    db_model = models.MLModel(
        name=model_data.name,
        algorithm=model_data.algorithm,
        n_transactions=model_data.n_transactions,
        file_path=file_path,
    )
    db.add(db_model)
    db.commit()
    db.refresh(db_model)

    try:
        # 3️⃣ Chargement du pipeline complet (FeatureEngineer + Preprocessing + XGB)
        model = joblib.load(file_path)

        # 4️⃣ Chargement du dataset de test brut
        test_data = pd.read_csv("data/test_data.csv")

        test_data["hour"] = test_data["step"] % 24

        # ❗ Le pipeline appliquera FeatureEngineer + preprocessing automatiquement
        X_test = test_data.drop(columns=["isFraud","isFlaggedFraud","step"])
        y_true = test_data["isFraud"].astype(int).values

        # 5️⃣ Prédictions probabilistes
        y_scores = model.predict_proba(X_test)[:, 1]

        # 6️⃣ Recherche du meilleur threshold
        thresholds = np.arange(0.01, 1.00, 0.01)
        best_threshold = 0.5
        best_f1 = 0

        for thr in thresholds:
            y_pred_thr = (y_scores >= thr).astype(int)
            f1_thr = f1_score(y_true, y_pred_thr, zero_division=0)

            if f1_thr > best_f1:
                best_f1 = f1_thr
                best_threshold = thr

        # 7️⃣ Prédictions finales avec le meilleur seuil
        y_pred_final = (y_scores >= best_threshold).astype(int)

        # 8️⃣ Calcul métriques
        f1 = f1_score(y_true, y_pred_final, zero_division=0)
        precision = precision_score(y_true, y_pred_final, zero_division=0)
        recall = recall_score(y_true, y_pred_final, zero_division=0)
        accuracy = accuracy_score(y_true, y_pred_final)

        # 9️⃣ Mise à jour DB
        db_model.f1_score = float(np.round(f1, 6))
        db_model.precision = float(np.round(precision, 6))
        db_model.recall = float(np.round(recall, 6))
        db_model.accuracy = float(np.round(accuracy, 6))
        db_model.best_threshold = float(np.round(best_threshold, 6))

        db.commit()
        db.refresh(db_model)

        # 🔎 Debug console
        print("Best threshold:", best_threshold)
        print("Confusion matrix:\n", confusion_matrix(y_true, y_pred_final))
        print(classification_report(y_true, y_pred_final, digits=4, zero_division=0))

        # 🔟 Réponse API
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
            "best_threshold": float(np.round(best_threshold, 6)),
            "created_at": db_model.created_at
        }

        return result_api

    except Exception as e:
        db.rollback()
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
