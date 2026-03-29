import pandas as pd
import numpy as np
import joblib
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from xgboost import XGBClassifier
from src.utils.preprocessing import FeatureEngineer   # FraudRateEncoder supprimé

# ============================================================
# 1. Chargement du dataset
# ============================================================
train_df = pd.read_csv("data/train_data.csv")


train_df["hour"] = train_df["step"] % 24
X_train = train_df.drop(columns=["isFraud", "isFlaggedFraud","step"])

# Cible
y_train = train_df["isFraud"]

# Colonnes à supprimer (comme dans ton notebook)
# columns_to_drop = ['isFraud', 'isFlaggedFraud', 'nameOrig', 'nameDest']
# X_train = train_df.drop(columns=columns_to_drop)

# ============================================================
# 2. Définition des features restant après FeatureEngineer
# ============================================================

# Colonnes numériques originales
numerical_features = [
    'amount', 'oldbalanceOrg', 'newbalanceOrig',
    'oldbalanceDest', 'newbalanceDest',
]

# Colonnes ajoutées par FeatureEngineer
engineered_features = [
    'hour',
    'is_zeroBalanceOrig',
    'is_zeroBalanceDest',
    'balance_diff_Orig',
    'is_high_value',
    'dest_to_old_ratio'
]

# Catégorique
categorical_features = ['type']

# Toutes les colonnes numériques du modèle final
all_numeric_features = numerical_features + engineered_features

# ============================================================
# 3. Preprocessor
# ============================================================
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), all_numeric_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ]
)

# ============================================================
# 4. Pipeline final
# ============================================================
model = Pipeline(steps=[
    ("features", FeatureEngineer()),   # Ajoute TES features engineered
    ("preprocess", preprocessor),
    ("classifier", XGBClassifier(
        scale_pos_weight=((y_train == 0).sum() / (y_train == 1).sum()),
        n_estimators=300,
        max_depth=6,
        colsample_bytree=0.7,
        subsample=0.8,
        learning_rate=0.1,
        eval_metric='logloss',
        random_state=42,
        n_jobs=-1
    ))
])

# ============================================================
# 5. Entraînement & sauvegarde
# ============================================================
model.fit(X_train, y_train)

joblib.dump(model, "ml_models_1/XGB_Pipeline_new.pkl")
print("✅ Modèle sauvegardé : ml_models_1/fraud_model_XGB.pkl")
