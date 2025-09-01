import pandas as pd
import numpy as np
import joblib
from lightgbm import LGBMClassifier

# ---------------------------
# 1️⃣ Entraînement LightGBM
# ---------------------------
X_train_cs = pd.read_csv("data/X_train.csv")
y_train = pd.read_csv("data/y_train.csv").values.ravel()  # conversion en 1D

lightgbm = LGBMClassifier()
lightgbm.fit(X_train_cs, y_train)

# Sauvegarde du modèle
joblib.dump(lightgbm, "ml_models_1/fraud_model_new_LGBM.pkl")
print("✅ Modèle LightGBM entraîné et sauvegardé !")