import pandas as pd
import numpy as np
import joblib
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from src.utils.preprocessing import FeatureEngineer , FraudRateEncoder

numerical_features = [
    'amt', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest',
    'hour','minute','weekday','orig_tx_count','dest_received_count','fraud_rate_orig',
    'is_weekend','is_night','balance_delta_orig','balance_delta_dest',
    'transaction_ratio_orig','transaction_ratio_dest','balance_change_orig_ratio',
    'balance_change_dest_ratio','is_full_balance_transfer','orig_tx_sum','dest_received_sum',
    'orig_tx_mean','dest_received_mean','orig_tx_max','dest_received_max','orig_tx_std',
    'dest_received_std','same_sender_receiver'
]

categorical_features = ['type']

train_df = pd.read_csv("data/train.csv")
X_train = train_df.drop("isFraud", axis=1)
y_train = train_df["isFraud"]


preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ]
)

model = Pipeline(steps=[
    ("fraud_rate", FraudRateEncoder()),
    ("features", FeatureEngineer()),
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(
        random_state=42,
        class_weight='balanced_subsample',
        n_estimators=2000,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=3,
        n_jobs=-1
    ))
])

model.fit(X_train, y_train)
joblib.dump(model, "ml_models_1/fraud_model.pkl")
print("✅ Modèle sauvegardé : ml_models/fraud_model.pkl")
