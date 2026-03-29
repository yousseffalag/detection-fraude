import pandas as pd
import numpy as np
import joblib
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
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
    ("classifier", RandomForestClassifier(
        max_depth=None,     # profondeur illimitée
        n_estimators=100,   # nombre d’arbres
        random_state=42     # optionnel, pour reproductibilité
    ))
])

# ============================================================
# 5. Entraînement & sauvegarde
# ============================================================
model.fit(X_train, y_train)

joblib.dump(model, "ml_models_1/RF_Pipeline_new.pkl")
print("✅ Modèle sauvegardé : ml_models_1/fraud_model_RF.pkl")
