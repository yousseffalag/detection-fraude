from sqlalchemy.orm import Session,joinedload
from sqlalchemy import func, extract,case
from datetime import datetime, timedelta
from src.transaction.model import Transaction
from fastapi import Depends, HTTPException, Query
from src.transaction import schemas
from src.ML_Model.models import MLModel
from typing import List,Optional
from src.auth.model import User
from src.core.security import get_admin_user
from src.database import get_db
import numpy as np
from src.ML_Model.loader import load_model
import shap
import pandas as pd
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.calibration import CalibratedClassifierCV
from src.ML_Model.models import MLModel


def soften_probability(prob, factor=5):
    """Adoucir la probabilité pour éviter les extrêmes"""
    return 1 / (1 + np.exp(-factor * (prob - 0.5)))

def convert_shap_to_json(shap_dict):
    """Convertit tous les numpy.float32 en float natif Python pour JSON."""
    if not shap_dict:
        return None
    return {k: float(v) for k, v in shap_dict.items()}

def predict_transaction_service(db: Session, data: schemas.TransactionPredictionRequest, user_id: int):
    """Prédit si une transaction est frauduleuse, calcule SHAP et sauvegarde."""

    # 1️⃣ Charger le pipeline ML
    ml_model = db.query(MLModel).filter(MLModel.id == data.ml_model_id).first()
    if not ml_model or not ml_model.file_path:
        raise HTTPException(status_code=404, detail="ML Model not found")

    try:
        pipeline = joblib.load(ml_model.file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur chargement pipeline: {e}")

    # 2️⃣ Préparer le DataFrame d'entrée (colonnes brutes)
    df = pd.DataFrame([{
        "hour": data.hour,
        "nameOrig": data.nameOrig,
        "nameDest": data.nameDest,
        "oldbalanceOrg": data.oldbalanceOrg,
        "newbalanceOrig": data.newbalanceOrig,
        "oldbalanceDest": data.oldbalanceDest,
        "newbalanceDest": data.newbalanceDest,
        "amount": data.amt,
        "type": data.type
    }])

    # 3️⃣ Prédiction de probabilité
    try:
        prob_raw = float(pipeline.predict_proba(df)[0][1])
        prob = soften_probability(prob_raw, factor=5)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la prédiction: {e}")

    # 4️⃣ Déterminer la prédiction binaire
    threshold = ml_model.best_threshold if ml_model.best_threshold else 0.5
    pred = int(prob >= threshold)

    # 5️⃣ Calcul des SHAP values
    try:
        # On transforme df avec le pipeline complet jusqu'à XGB
        # FeatureEngineer et preprocessing sont inclus dans le pipeline
        X_transformed = pipeline.named_steps['preprocess'].transform(
            pipeline.named_steps['features'].transform(df)
        )
        
        # Colonnes après transformation
        cat_cols = pipeline.named_steps['preprocess'].named_transformers_['cat'].get_feature_names_out(['type'])
        num_cols = pipeline.named_steps['preprocess'].named_transformers_['num'].feature_names_in_
        all_cols = list(num_cols) + list(cat_cols)
        X_transformed_df = pd.DataFrame(X_transformed, columns=all_cols)

        # SHAP TreeExplainer
        explainer = shap.TreeExplainer(pipeline.named_steps['classifier'])
        shap_values = explainer.shap_values(X_transformed_df)
        shap_dict = dict(zip(X_transformed_df.columns, shap_values[0]))

        # Normalisation
        max_abs = max(abs(v) for v in shap_dict.values()) or 1
        shap_dict_normalized = {k: float(v) / max_abs for k, v in shap_dict.items()}
        shap_dict_json = convert_shap_to_json(shap_dict_normalized)
    except Exception:
        shap_dict_json = None

    # 6️⃣ Sauvegarder la transaction
    transaction = Transaction(
        type=data.type,
        amt=data.amt,
        nameOrig=data.nameOrig,
        oldbalanceOrg=data.oldbalanceOrg,
        newbalanceOrig=data.newbalanceOrig,
        nameDest=data.nameDest,
        oldbalanceDest=data.oldbalanceDest,
        newbalanceDest=data.newbalanceDest,
        isFraud=pred,
        weekday=data.weekday,
        hour=data.hour,
        probability=float(prob),
        influencing_factors=shap_dict_json,
        user_id=user_id,
        ml_model_id=data.ml_model_id
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    # 7️⃣ Retourner la réponse
    return schemas.TransactionPredictionResponse(
        prediction=pred,
        probability=float(prob),
        influencing_factors=shap_dict_json
    )



def predict_transactions_batch(
    db: Session,
    user_id: int,
    ml_model_id: int,
    df: pd.DataFrame = None,
    csv_path: str = None
):
    """
    Prédit plusieurs transactions à partir d'un DataFrame ou CSV.
    Retourne les prédictions détaillées + statistiques globales :
    - nombre total de transactions
    - nombre légitimes et frauduleuses
    - répartition par type (avec légitimes et frauduleuses)
    - répartition par plages de montant (avec légitimes et frauduleuses)
    - évolution temporelle par heure
    Compatible avec le pipeline FeatureEngineer + Preprocessor + XGBClassifier.
    """

    # -----------------------------
    # 2️⃣ Charger le pipeline ML
    # -----------------------------
    ml_model = db.query(MLModel).filter(MLModel.id == ml_model_id).first()
    if not ml_model or not ml_model.file_path:
        raise HTTPException(status_code=404, detail="ML Model introuvable")
    pipeline = joblib.load(ml_model.file_path)

    results = []

    # -----------------------------
    # 3️⃣ Boucle sur chaque transaction
    # -----------------------------
    for _, row in df.iterrows():
        single_df = pd.DataFrame([{
            "hour": row["hour"],
            "nameOrig": row["nameOrig"],
            "nameDest": row["nameDest"],
            "oldbalanceOrg": row["oldbalanceOrg"],
            "newbalanceOrig": row["newbalanceOrig"],
            "oldbalanceDest": row["oldbalanceDest"],
            "newbalanceDest": row["newbalanceDest"],
            "amount": row["amount"],
            "type": row["type"]
        }])

        # Prédiction
        try:
            prob_raw = float(pipeline.predict_proba(single_df)[0][1])
            prob = soften_probability(prob_raw, factor=5)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erreur prédiction: {e}")

        # Prédiction binaire
        threshold = ml_model.best_threshold if ml_model.best_threshold else 0.5
        pred = int(prob >= threshold)

        # SHAP (optionnel)
        try:
            X_transformed = pipeline.named_steps['preprocess'].transform(
                pipeline.named_steps['features'].transform(single_df)
            )
            cat_cols = pipeline.named_steps['preprocess'].named_transformers_['cat'].get_feature_names_out(['type'])
            num_cols = pipeline.named_steps['preprocess'].named_transformers_['num'].feature_names_in_
            all_cols = list(num_cols) + list(cat_cols)
            X_transformed_df = pd.DataFrame(X_transformed, columns=all_cols)

            explainer = shap.TreeExplainer(pipeline.named_steps['classifier'])
            shap_values = explainer.shap_values(X_transformed_df)
            shap_dict = dict(zip(X_transformed_df.columns, shap_values[0]))
            max_abs = max(abs(v) for v in shap_dict.values()) or 1
            shap_dict_normalized = {k: float(v) / max_abs for k, v in shap_dict.items()}
            shap_dict_json = convert_shap_to_json(shap_dict_normalized)
        except Exception:
            shap_dict_json = None

        # Sauvegarde en DB
        transaction = Transaction(
            type=row["type"],
            amt=row["amount"],
            nameOrig=row["nameOrig"],
            oldbalanceOrg=row["oldbalanceOrg"],
            newbalanceOrig=row["newbalanceOrig"],
            nameDest=row["nameDest"],
            oldbalanceDest=row["oldbalanceDest"],
            newbalanceDest=row["newbalanceDest"],
            isFraud=pred,
            weekday=row.get("day_of_week", 0),
            hour=row["hour"],
            probability=float(prob),
            influencing_factors=shap_dict_json,
            user_id=user_id,
            ml_model_id=ml_model_id
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)

        results.append(schemas.TransactionPredictionResponse(
            prediction=pred,
            probability=float(prob),
            influencing_factors=shap_dict_json
        ))

    # -----------------------------
    # 4️⃣ Statistiques globales détaillées
    # -----------------------------
    total = len(results)
    legit = sum(1 for r in results if r.prediction == 0)
    fraud = total - legit
    avg_risk = round(float(np.mean([r.probability for r in results])) * 100, 2) if total else 0

    # Ajouter colonnes nécessaires
    df["prediction"] = [r.prediction for r in results]
    df["probability"] = [r.probability for r in results]
    df["hour_of_day"] = pd.to_numeric(df["hour"], errors="coerce").fillna(0).astype(int)
    df["day_of_week"] = pd.to_numeric(df.get("day_of_week", 0), errors="coerce").fillna(0).astype(int)

    # 1️⃣ Évolution temporelle par heure
    time_series = {}
    for h in range(24):
        hour_df = df[df["hour_of_day"] == h]
        time_series[h] = {
            "fraudulent": int((hour_df["prediction"] == 1).sum()),
            "legitimate": int((hour_df["prediction"] == 0).sum()),
            "total": len(hour_df)
        }

    # 2️⃣ Répartition par type
    types = {}
    for t, group in df.groupby("type"):
        types[t] = {
            "fraudulent": int((group["prediction"] == 1).sum()),
            "legitimate": int((group["prediction"] == 0).sum()),
            "total": len(group)
        }

    # 3️⃣ Répartition par plages de montant
    bins = [0, 1000, 5000, 10000, 50000, np.inf]
    labels = ["0-1k", "1k-5k", "5k-10k", "10k-50k", "50k+"]
    df["amount_range"] = pd.cut(df["amount"], bins=bins, labels=labels, include_lowest=True)
    amounts = {}
    for r, group in df.groupby("amount_range"):
        amounts[str(r)] = {
            "fraudulent": int((group["prediction"] == 1).sum()),
            "legitimate": int((group["prediction"] == 0).sum()),
            "total": len(group)
        }

    # Statistiques finales
    stats = {
        "total_transactions": total,
        "legit_transactions": legit,
        "fraud_transactions": fraud,
        "legit_percentage": round(100 * legit / total, 2) if total else 0,
        "fraud_percentage": round(100 * fraud / total, 2) if total else 0,
        "average_risk_percentage": avg_risk,
        "transactions_by_type": types,
        "time_series_by_hour": time_series,
        "transactions_by_amount_range": amounts
    }

    return {"transactions": results, "stats": stats}



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


def get_risk_level(probability: float) -> str:
    """Détermine le niveau de risque à partir de la probabilité"""
    if probability < 0.3:
        return "faible"
    elif probability < 0.7:
        return "modéré"
    else:
        return "élevé"


def get_stats_user(db: Session, user_id: int):
    today = datetime.utcnow()
    current_year = today.year
    prev_year = current_year - 1

    # --- Transactions pour l'année en cours ---
    total_current = db.query(func.count()).filter(
        Transaction.user_id == user_id,
        extract("year", Transaction.created_at) == current_year
    ).scalar()

    fraud_current = db.query(func.count()).filter(
        Transaction.user_id == user_id,
        extract("year", Transaction.created_at) == current_year,
        Transaction.isFraud == 1
    ).scalar()

    # --- Transactions pour l'année précédente ---
    total_prev = db.query(func.count()).filter(
        Transaction.user_id == user_id,
        extract("year", Transaction.created_at) == prev_year
    ).scalar()

    fraud_prev = db.query(func.count()).filter(
        Transaction.user_id == user_id,
        extract("year", Transaction.created_at) == prev_year,
        Transaction.isFraud == 1
    ).scalar()

    # --- Calcul des taux ---
    fraud_rate_current = (fraud_current / total_current * 100) if total_current > 0 else 0
    fraud_rate_prev = (fraud_prev / total_prev * 100) if total_prev > 0 else 0

    # --- Calcul évolution en pourcentage ---
    total_evolution = ((total_current - total_prev) / total_prev * 100) if total_prev > 0 else 0
    fraud_evolution = ((fraud_current - fraud_prev) / fraud_prev * 100) if fraud_prev > 0 else 0
    fraud_rate_evolution = fraud_rate_current - fraud_rate_prev

    return {
        "total_transactions": {
            "current_year": total_current,
            "previous_year": total_prev,
            "evolution_percent": total_evolution
        },
        "suspect_transactions": {
            "current_year": fraud_current,
            "previous_year": fraud_prev,
            "evolution_percent": fraud_evolution
        },
        "fraud_rate_percent": {
            "current_year": fraud_rate_current,
            "previous_year": fraud_rate_prev,
            "evolution_percent": fraud_rate_evolution
        }
    }

def get_all_transactions(
    db: Session,
    status: Optional[str] = None,
    risk: Optional[str] = None,
    page: int = 1,
    page_size: int = 6  # 👈 fixé à 6 par défaut
):
    query = db.query(Transaction).options(
        joinedload(Transaction.user),
        joinedload(Transaction.ml_model)
    )

    # 🎭 Filtre par status
    if status in ["completed", "failed"]:
        query = query.filter(Transaction.status == status)
    elif status == "accepted":  # 👈 accepté = pas frauduleux
        query = query.filter(Transaction.isFraud == 0)
    elif status == "rejected":  # 👈 rejeté = frauduleux
        query = query.filter(Transaction.isFraud == 1)

    total = query.count()

    # Pagination SQL
    transactions = query.offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for tx in transactions:
        tx_risk = get_risk_level(tx.probability)
        if risk and tx_risk != risk:
            continue

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
            "probability": tx.probability,
            "risk": tx_risk,
            "influencing_factors": tx.influencing_factors,
            "user": {
                "username": tx.user.username if tx.user else None,
                "email": tx.user.email if tx.user else None
            },
            "model": {
                "id": tx.ml_model.id if tx.ml_model else None,
                "name": tx.ml_model.name if tx.ml_model else None,
                "algorithm": tx.ml_model.algorithm if tx.ml_model else None
            }
        })

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "transactions": result,
        "pages": (total + page_size - 1) // page_size
    }

def get_transaction_stats(db: Session):
    current_year = datetime.now().year
    prev_year = current_year - 1

    # --- Transactions totales ---
    total_current = db.query(func.count(Transaction.id)).filter(
        func.extract("year", Transaction.created_at) == current_year
    ).scalar()

    total_prev = db.query(func.count(Transaction.id)).filter(
        func.extract("year", Transaction.created_at) == prev_year
    ).scalar()

    # --- Transactions non frauduleuses ---
    nonfraud_current = db.query(func.count(Transaction.id)).filter(
        func.extract("year", Transaction.created_at) == current_year,
        Transaction.isFraud == 0
    ).scalar()

    nonfraud_prev = db.query(func.count(Transaction.id)).filter(
        func.extract("year", Transaction.created_at) == prev_year,
        Transaction.isFraud == 0
    ).scalar()

    # --- Transactions frauduleuses ---
    fraud_current = db.query(func.count(Transaction.id)).filter(
        func.extract("year", Transaction.created_at) == current_year,
        Transaction.isFraud == 1
    ).scalar()

    fraud_prev = db.query(func.count(Transaction.id)).filter(
        func.extract("year", Transaction.created_at) == prev_year,
        Transaction.isFraud == 1
    ).scalar()

    # --- Taux de fraude ---
    fraud_rate_current = (fraud_current / total_current * 100) if total_current > 0 else 0
    fraud_rate_prev = (fraud_prev / total_prev * 100) if total_prev > 0 else 0

    # --- Calcul des pourcentages ---
    def calc_percent_change(current, prev):
        if prev == 0:
            return 100 if current > 0 else 0
        return round(((current - prev) / prev) * 100, 2)

    # --- Transactions frauduleuses par type ---
    fraud_by_type = db.query(
        Transaction.type,
        func.count(Transaction.id).label("total"),
        func.sum(case((Transaction.isFraud == 1, 1), else_=0)).label("fraud"),
        func.sum(case((Transaction.isFraud == 0, 1), else_=0)).label("nonfraud"),
    ).filter(
        func.extract("year", Transaction.created_at) == current_year
    ).group_by(Transaction.type).all()

    fraud_by_type_stats = []
    for ttype, total, fraud, nonfraud in fraud_by_type:
        fraud_rate = (fraud / total * 100) if total > 0 else 0
        fraud_by_type_stats.append({
            "type": ttype,
            "total": total,
            "fraud": fraud,
            "nonfraud": nonfraud,
            "fraud_rate": round(fraud_rate, 2)
        })

    # --- Distribution des montants ---
    ranges = [
        (0, 100),
        (100, 250),
        (250, 500),
        (500, 1000),
        (1000, 2500),
        (2500, 5000),
        (5000, 10000),
        (10000, None)
    ]

    distribution_stats = []
    for lower, upper in ranges:
        query = db.query(
            func.count(Transaction.id).label("total"),
            func.sum(case((Transaction.isFraud == 1, 1), else_=0)).label("fraud"),
            func.sum(case((Transaction.isFraud == 0, 1), else_=0)).label("nonfraud"),
        ).filter(
            func.extract("year", Transaction.created_at) == current_year
        )

        if upper is None:
            query = query.filter(Transaction.amt > lower)
            label = f">{lower}"
        else:
            query = query.filter(Transaction.amt >= lower, Transaction.amt < upper)
            label = f"{lower}-{upper}"

        row = query.one()
        total, fraud, nonfraud = row
        fraud_rate = (fraud / total * 100) if total > 0 else 0

        distribution_stats.append({
            "range": label,
            "total": total,
            "fraud": fraud,
            "nonfraud": nonfraud,
            "fraud_rate": round(fraud_rate, 2)
        })

    return {
        "total_transactions": {
            "value": total_current,
            "change_percent": calc_percent_change(total_current, total_prev)
        },
        "nonfraud_transactions": {
            "value": nonfraud_current,
            "change_percent": calc_percent_change(nonfraud_current, nonfraud_prev)
        },
        "fraud_transactions": {
            "value": fraud_current,
            "change_percent": calc_percent_change(fraud_current, fraud_prev)
        },
        "fraud_rate": {
            "value": round(fraud_rate_current, 2),
            "change_percent": calc_percent_change(fraud_rate_current, fraud_rate_prev)
        },
        "fraud_by_type": fraud_by_type_stats,
        "amount_distribution": distribution_stats
    }


def get_all_transactions_for_specific_user(
    db: Session,
    current_user_id: int,  # ID de l'utilisateur connecté
    status: Optional[str] = None,
    risk: Optional[str] = None,
    page: int = 1,
    page_size: int = 10
):
    # Base query: filtrer uniquement pour l'utilisateur connecté
    query = db.query(Transaction).options(
        joinedload(Transaction.user),
        joinedload(Transaction.ml_model)
    ).filter(Transaction.user_id == current_user_id)

    # 🎭 Filtre par status
    if status in ["completed", "failed"]:
        query = query.filter(Transaction.status == status)
    elif status == "accepted":  # 👈 accepté = pas frauduleux
        query = query.filter(Transaction.isFraud == 0)
    elif status == "rejected":  # 👈 rejeté = frauduleux
        query = query.filter(Transaction.isFraud == 1)

    total = query.count()

    # Pagination SQL
    transactions = query.offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for tx in transactions:
        tx_risk = get_risk_level(tx.probability)
        if risk and tx_risk != risk:
            continue

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
            "probability": tx.probability,
            "risk": tx_risk,
            "influencing_factors": tx.influencing_factors,
            "user": {
                "username": tx.user.username if tx.user else None,
                "email": tx.user.email if tx.user else None
            },
            "model": {
                "id": tx.ml_model.id if tx.ml_model else None,
                "name": tx.ml_model.name if tx.ml_model else None,
                "algorithm": tx.ml_model.algorithm if tx.ml_model else None
            }
        })

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "transactions": result,
        "pages": (total + page_size - 1) // page_size
    }




    # # 1️⃣ Récupérer le modèle choisi
    # ml_model = db.query(MLModel).filter(MLModel.id == data.ml_model_id).first()
    # if not ml_model or not ml_model.file_path:
    #     raise ValueError("Modèle introuvable ou fichier non défini.")

    # model = load_model(ml_model.file_path)

    # # 2️⃣ Préparer les features
    # features = np.array([[
    #     data.amt,
    #     data.oldbalanceOrg,
    #     data.newbalanceOrig,
    #     data.oldbalanceDest,
    #     data.newbalanceDest,
    #     data.weekday,
    #     data.hour,
    #     data.minute
    # ]])

    # # 3️⃣ Prédiction
    # prob = float(model.predict_proba(features)[0][1])
    # pred = int(prob >= ml_model.best_threshold)  # ⚠️ tu peux remplacer par ton best_threshold

    # # 4️⃣ SHAP (optionnel pour explication)
    # explainer = shap.TreeExplainer(model)
    # shap_values = explainer.shap_values(features)
    # factors = {f"feature_{i}": float(val) for i, val in enumerate(shap_values[1][0])}

    # # 5️⃣ Sauvegarder la transaction avec le résultat
    # transaction = Transaction(
    #     type=data.type,
    #     amt=data.amt,
    #     nameOrig=data.nameOrig,
    #     oldbalanceOrg=data.oldbalanceOrg,
    #     newbalanceOrig=data.newbalanceOrig,
    #     nameDest=data.nameDest,
    #     oldbalanceDest=data.oldbalanceDest,
    #     newbalanceDest=data.newbalanceDest,
    #     isFraud=pred,
    #     weekday=data.weekday,
    #     hour=data.hour,
    #     minute=data.minute,
    #     probability=prob,
    #     influencing_factors=factors,
    #     user_id=user_id,
    #     ml_model_id=data.ml_model_id
    # )

    # db.add(transaction)
    # db.commit()
    # db.refresh(transaction)

    # return schemas.TransactionPredictionResponse(
    #     prediction=pred,
    #     probability=prob,
    #     influencing_factors=factors
    # )

def get_user_transaction_stats(db: Session, user_id: int):
    current_year = datetime.now().year
    prev_year = current_year - 1

    # --- Transactions totales ---
    total_current = db.query(func.count(Transaction.id)).filter(
        Transaction.user_id == user_id,
        func.extract("year", Transaction.created_at) == current_year
    ).scalar()

    total_prev = db.query(func.count(Transaction.id)).filter(
        Transaction.user_id == user_id,
        func.extract("year", Transaction.created_at) == prev_year
    ).scalar()

    # --- Transactions non frauduleuses ---
    nonfraud_current = db.query(func.count(Transaction.id)).filter(
        Transaction.user_id == user_id,
        func.extract("year", Transaction.created_at) == current_year,
        Transaction.isFraud == 0
    ).scalar()

    nonfraud_prev = db.query(func.count(Transaction.id)).filter(
        Transaction.user_id == user_id,
        func.extract("year", Transaction.created_at) == prev_year,
        Transaction.isFraud == 0
    ).scalar()

    # --- Transactions frauduleuses ---
    fraud_current = db.query(func.count(Transaction.id)).filter(
        Transaction.user_id == user_id,
        func.extract("year", Transaction.created_at) == current_year,
        Transaction.isFraud == 1
    ).scalar()

    fraud_prev = db.query(func.count(Transaction.id)).filter(
        Transaction.user_id == user_id,
        func.extract("year", Transaction.created_at) == prev_year,
        Transaction.isFraud == 1
    ).scalar()

    # --- Taux de fraude ---
    fraud_rate_current = (fraud_current / total_current * 100) if total_current > 0 else 0
    fraud_rate_prev = (fraud_prev / total_prev * 100) if total_prev > 0 else 0

    # --- Calcul des pourcentages ---
    def calc_percent_change(current, prev):
        if prev == 0:
            return 100 if current > 0 else 0
        return round(((current - prev) / prev) * 100, 2)

    # --- Transactions frauduleuses par type ---
    fraud_by_type = db.query(
        Transaction.type,
        func.count(Transaction.id).label("total"),
        func.sum(case((Transaction.isFraud == 1, 1), else_=0)).label("fraud"),
        func.sum(case((Transaction.isFraud == 0, 1), else_=0)).label("nonfraud"),
    ).filter(
        Transaction.user_id == user_id,
        func.extract("year", Transaction.created_at) == current_year
    ).group_by(Transaction.type).all()

    fraud_by_type_stats = []
    for ttype, total, fraud, nonfraud in fraud_by_type:
        fraud_rate = (fraud / total * 100) if total > 0 else 0
        fraud_by_type_stats.append({
            "type": ttype,
            "total": total,
            "fraud": fraud,
            "nonfraud": nonfraud,
            "fraud_rate": round(fraud_rate, 2)
        })

    # --- Distribution des montants ---
    ranges = [
        (0, 100),
        (100, 250),
        (250, 500),
        (500, 1000),
        (1000, 2500),
        (2500, 5000),
        (5000, 10000),
        (10000, None)
    ]

    distribution_stats = []
    for lower, upper in ranges:
        query = db.query(
            func.count(Transaction.id).label("total"),
            func.sum(case((Transaction.isFraud == 1, 1), else_=0)).label("fraud"),
            func.sum(case((Transaction.isFraud == 0, 1), else_=0)).label("nonfraud"),
        ).filter(
            Transaction.user_id == user_id,
            func.extract("year", Transaction.created_at) == current_year
        )

        if upper is None:
            query = query.filter(Transaction.amt > lower)
            label = f">{lower}"
        else:
            query = query.filter(Transaction.amt >= lower, Transaction.amt < upper)
            label = f"{lower}-{upper}"

        row = query.one()
        total, fraud, nonfraud = row
        fraud_rate = (fraud / total * 100) if total > 0 else 0

        distribution_stats.append({
            "range": label,
            "total": total,
            "fraud": fraud,
            "nonfraud": nonfraud,
            "fraud_rate": round(fraud_rate, 2)
        })

    return {
        "total_transactions": {
            "value": total_current,
            "change_percent": calc_percent_change(total_current, total_prev)
        },
        "nonfraud_transactions": {
            "value": nonfraud_current,
            "change_percent": calc_percent_change(nonfraud_current, nonfraud_prev)
        },
        "fraud_transactions": {
            "value": fraud_current,
            "change_percent": calc_percent_change(fraud_current, fraud_prev)
        },
        "fraud_rate": {
            "value": round(fraud_rate_current, 2),
            "change_percent": calc_percent_change(fraud_rate_current, fraud_rate_prev)
        },
        "fraud_by_type": fraud_by_type_stats,
        "amount_distribution": distribution_stats
    }
