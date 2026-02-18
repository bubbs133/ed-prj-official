import joblib
import os

"""BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "gmm_model_tied_scaled_1_4.pkl")

SCALER_PATH = os.path.join(BASE_DIR, "ml", "scaler_gmm_tied_scaled_1_4.pkl")

gmm_model = joblib.load(MODEL_PATH)
gmm_scaler = joblib.load(SCALER_PATH)"""

#V2
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

V2_MODEL_PATH = os.path.join(BASE_DIR, "ml", "v2_gmm_model_updated3_features_diag.pkl")

V2_SCALER_PATH = os.path.join(BASE_DIR, "ml", "v2_scaler_gmm_diag_updated3_features.pkl")

v2_gmm_model = joblib.load(V2_MODEL_PATH)
v2_gmm_scaler = joblib.load(V2_SCALER_PATH)