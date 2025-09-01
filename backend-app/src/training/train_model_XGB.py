import pandas as pd
import numpy as np
import joblib
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from xgboost import XGBClassifier
from src.utils.preprocessing import FeatureEngineer,FraudRateEncoder



train_df = pd.read_csv("data/train.csv")
X_train = train_df.drop("isFraud", axis=1)
y_train = train_df["isFraud"]

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
    ("classifier", XGBClassifier(
        scale_pos_weight=((y_train==0).sum() / (y_train==1).sum()) * 3,
        n_estimators=500,
        max_depth=20,
        colsample_bytree=0.64,
        subsample=0.2,
        learning_rate=0.02,
        use_label_encoder=False,
        eval_metric='logloss',
        random_state=42,
        n_jobs=-1
    ))
])

model.fit(X_train, y_train)
joblib.dump(model, "ml_models_1/fraud_modeXGB.pkl")
print("✅ Modèle sauvegardé : ml_models/fraud_model.pkl")
