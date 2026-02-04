import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "python", "gmm_model_tied_scaled_1_4.pkl")

SCALER_PATH = os.path.join(BASE_DIR, "python", "scaler_gmm_tied_scaled_1_4.pkl")

gmm_model = joblib.load(MODEL_PATH)
gmm_scaler = joblib.load(SCALER_PATH)