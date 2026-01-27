from sklearn.preprocessing import StandardScaler

from sklearn.mixture import GaussianMixture

import numpy as np
import pandas as pd

df = pd.read_csv("/Users/avatarvaleria/Projects/colabs/ed-prj/ed-backend/tracking/python/tracking_data5.csv")
df_features = df.iloc[:, 1:]

scaler = StandardScaler()
features_scaled = scaler.fit_transform(df_features)

gmm = GaussianMixture(n_components=4, covariance_type='tied', random_state=42)

gmm.fit(features_scaled)

test_pred = [1.0,1.0,2.0,2.0,2.0,9.0]

scaled_pred = scaler.transform([test_pred])

print("Predictions:", gmm.predict(scaled_pred))
print("Predictions Prob:", gmm.predict_proba(scaled_pred))
