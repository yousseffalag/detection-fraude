import joblib


def load_model(file_path: str):
    return joblib.load(file_path)
