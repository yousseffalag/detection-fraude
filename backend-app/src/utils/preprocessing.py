import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin

# ============================================================
# FEATURE ENGINEER EXACTEMENT COMME DANS TON NOTEBOOK
# ============================================================

class FeatureEngineer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()

        # === EXACTEMENT LES FEATURES DU NOTEBOOK ===
        X["is_zeroBalanceOrig"] = (X["oldbalanceOrg"] == 0).astype(int)
        X["is_zeroBalanceDest"] = (X["oldbalanceDest"] == 0).astype(int)
        X["balance_diff_Orig"] = np.abs(X["oldbalanceOrg"] - X["newbalanceOrig"])

        threshold = X["amount"].quantile(0.95)
        X["is_high_value"] = (X["amount"] > threshold).astype(int)

        X["dest_to_old_ratio"] = X["amount"] / (X["oldbalanceDest"] + 1)

        X.drop(columns=['nameOrig', 'nameDest'],axis=1, inplace=True)

        return X

    # ========================================================
    # LISTE DES FEATURES EN SORTIE
    # ========================================================
    def get_feature_names_out(self, input_features=None):
        base_features = [
            "amount", "oldbalanceOrg", "newbalanceOrig",
            "oldbalanceDest", "newbalanceDest", "type"
        ]

        engineered_features = [
            "hour",
            "is_zeroBalanceOrig",
            "is_zeroBalanceDest",
            "balance_diff_Orig",
            "is_high_value",
            "dest_to_old_ratio"
        ]

        return np.array(base_features + engineered_features)
