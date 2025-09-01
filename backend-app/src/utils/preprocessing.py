import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin

class FraudRateEncoder(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        df = X.copy()
        df["target"] = y
        self.fraud_rate_map = df.groupby("nameOrig")["target"].mean().to_dict()
        return self
    def transform(self, X):
        X = X.copy()
        X["fraud_rate_orig"] = X["nameOrig"].map(self.fraud_rate_map).fillna(0)
        return X

class FeatureEngineer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        eps = 1e-6
        X = X.copy()
        X["orig_tx_count"] = X.groupby("nameOrig")["amt"].transform("count")
        X["dest_received_count"] = X.groupby("nameDest")["amt"].transform("count")
        X["orig_tx_sum"] = X.groupby("nameOrig")["amt"].transform("sum")
        X["dest_received_sum"] = X.groupby("nameDest")["amt"].transform("sum")
        X["orig_tx_mean"] = X.groupby("nameOrig")["amt"].transform("mean")
        X["dest_received_mean"] = X.groupby("nameDest")["amt"].transform("mean")
        X["orig_tx_max"] = X.groupby("nameOrig")["amt"].transform("max")
        X["dest_received_max"] = X.groupby("nameDest")["amt"].transform("max")
        X["orig_tx_std"] = X.groupby("nameOrig")["amt"].transform("std")
        X["dest_received_std"] = X.groupby("nameDest")["amt"].transform("std")
        X["is_weekend"] = (X["weekday"] >= 5).astype("int8")
        X["is_night"] = ((X["hour"] >= 22) | (X["hour"] <= 6)).astype("int8")
        X["balance_delta_orig"] = (X["oldbalanceOrg"] - X["newbalanceOrig"] - X["amt"]).astype("float32")
        X["balance_delta_dest"] = (X["newbalanceDest"] - X["oldbalanceDest"] - X["amt"]).astype("float32")
        X["transaction_ratio_orig"] = (X["amt"] / (X["oldbalanceOrg"] + eps)).replace([np.inf, -np.inf], 0).astype("float32")
        X["transaction_ratio_dest"] = (X["amt"] / (X["oldbalanceDest"] + eps)).replace([np.inf, -np.inf], 0).astype("float32")
        X["balance_change_orig_ratio"] = ((X["newbalanceOrig"] - X["oldbalanceOrg"]) / (X["oldbalanceOrg"] + eps)).replace([np.inf, -np.inf], 0).astype("float32")
        X["balance_change_dest_ratio"] = ((X["newbalanceDest"] - X["oldbalanceDest"]) / (X["oldbalanceDest"] + eps)).replace([np.inf, -np.inf], 0).astype("float32")
        X["is_full_balance_transfer"] = ((X["type"].isin(["TRANSFER", "CASH_OUT"])) & np.isclose(X["amt"], X["oldbalanceOrg"]) & (X["oldbalanceOrg"] > 0)).astype("int8")
        X["same_sender_receiver"] = (X["nameOrig"].astype(str) == X["nameDest"].astype(str)).astype("int8")
        return X
    
    def get_feature_names_out(self, input_features=None):
        base = ["amt","oldbalanceOrg","newbalanceOrig","oldbalanceDest","newbalanceDest","weekday","hour","minute","type","nameOrig","nameDest"]
        engineered = ["orig_tx_count","dest_received_count","orig_tx_sum","dest_received_sum",
                      "orig_tx_mean","dest_received_mean","orig_tx_max","dest_received_max",
                      "orig_tx_std","dest_received_std","is_weekend","is_night",
                      "balance_delta_orig","balance_delta_dest","transaction_ratio_orig",
                      "transaction_ratio_dest","balance_change_orig_ratio","balance_change_dest_ratio",
                      "is_full_balance_transfer","same_sender_receiver"]
        return np.array(base + engineered)
