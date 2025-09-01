import pandas as pd
import numpy as np
import joblib
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from src.utils.preprocessing import FraudRateEncoder, FeatureEngineer

numerical_features = [
    'amt','oldbalanceOrg','newbalanceOrig','oldbalanceDest','newbalanceDest',
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
        ("num", Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())]), numerical_features),
        ("cat", Pipeline([("imputer", SimpleImputer(strategy="most_frequent")), ("encoder", OneHotEncoder(handle_unknown="ignore"))]), categorical_features)
    ]
)

model = Pipeline(steps=[
    ("fraud_rate", FraudRateEncoder()),
    ("features", FeatureEngineer()),
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(max_iter=500, random_state=42, class_weight='balanced'))
])

model.fit(X_train, y_train)
joblib.dump(model, "ml_models_1/fraud_modelLR.pkl")
