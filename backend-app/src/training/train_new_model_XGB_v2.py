import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import f1_score, accuracy_score, precision_score, recall_score
import joblib

# 1️⃣ Charger les données
df = pd.read_csv("data/ai_ml_dataset.csv")

# 2️⃣ Nettoyage et mapping de la cible
df['isFraud'] = df['isFraud'].astype(str).str.strip().str.lower()
fraud_map = {'yes': 1, 'no': 0, 'y': 1, 'n': 0, '1': 1, '0': 0, 1: 1, 0: 0}
df = df[df['isFraud'].isin(fraud_map.keys())]
y = df['isFraud'].map(fraud_map)

# 3️⃣ Feature engineering
df['diff_new_old_balance'] = df['newbalanceOrig'] - df['oldbalanceOrg']
df['diff_new_old_destiny'] = df['newbalanceDest'] - df['oldbalanceDest']
df['ratio_amount_balanceOrig'] = df['amount'] / (df['oldbalanceOrg'] + 1e-9)
df['hour_of_day'] = df['step'] % 24
df['day_of_week'] = (df['step'] // 24) % 7
df['nameOrig'] = df['nameOrig'].apply(lambda i: i[0])
df['nameDest'] = df['nameDest'].apply(lambda i: i[0])

# 4️⃣ Sélection des features
features = [
    'hour_of_day', 'day_of_week', 'oldbalanceOrg', 'newbalanceOrig',
    'oldbalanceDest', 'newbalanceDest', 'diff_new_old_balance', 'diff_new_old_destiny',
    'ratio_amount_balanceOrig', 'type'
]
X = df[features]

# 5️⃣ Split train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# 6️⃣ Pipeline préprocessing
numeric_features = [
    'hour_of_day', 'day_of_week', 'oldbalanceOrg', 'newbalanceOrig',
    'oldbalanceDest', 'newbalanceDest', 'diff_new_old_balance',
    'diff_new_old_destiny', 'ratio_amount_balanceOrig'
]
categorical_features = ['type']

numeric_transformer = MinMaxScaler()
categorical_transformer = OneHotEncoder(sparse_output=False, handle_unknown='ignore')

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ]
)

# 7️⃣ Pipeline complet avec XGBClassifier
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', XGBClassifier(use_label_encoder=False, eval_metric='logloss'))
])

# 8️⃣ Entraînement
pipeline.fit(X_train, y_train)

# 9️⃣ Calibrage du classifieur pour probabilités douces
X_val_transformed = pipeline.named_steps['preprocessor'].transform(X_test)
classifier = pipeline.named_steps['classifier']

calibrated_clf = CalibratedClassifierCV(classifier, method='sigmoid', cv='prefit')
calibrated_clf.fit(X_val_transformed, y_test)

# Remplacer le classifieur par le classifieur calibré
pipeline.named_steps['classifier'] = calibrated_clf

# 🔟 Évaluation rapide
y_pred = pipeline.predict(X_test)
y_prob = pipeline.predict_proba(X_test)[:, 1]

print("F1:", f1_score(y_test, y_pred))
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall:", recall_score(y_test, y_pred))
print("Exemple probabilités douces :", y_prob[:10])

# 1️⃣1️⃣ Sauvegarde du pipeline complet calibré
joblib.dump(pipeline, "ml_models_1/fraud_model_pipeline_XGB_calibrated.pkl")
print("✅ Pipeline complet entraîné, calibré et sauvegardé !")
