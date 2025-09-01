import pandas as pd
import numpy as np
import joblib
from xgboost import XGBClassifier


# ---------------------------
# 1️⃣ Entraînement LightGBM
# ---------------------------
X_train_cs = pd.read_csv("data/X_train.csv")
y_train = pd.read_csv("data/y_train.csv").values.ravel()  # conversion en 1D


xgb = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
xgb.fit(X_train_cs, y_train)

# Sauvegarde modèle et transformateurs
joblib.dump(xgb, "ml_models_1/fraud_model_new_XGB.pkl")

print("✅ Modèle entraîné et sauvegardé avec succès !")
