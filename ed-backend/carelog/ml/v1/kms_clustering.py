from sklearn.preprocessing import StandardScaler

from sklearn.cluster import KMeans

import numpy as np
import pandas as pd

df = pd.read_csv("/Users/avatarvaleria/Projects/colabs/ed-prj/ed-backend/tracking/ml/tracking_data.csv")
df_features = df.iloc[:, 1:]

scaler = StandardScaler()
features_scaled = scaler.fit_transform(df_features)

kmeans = KMeans(n_clusters=3, random_state=42, n_init='auto')

kmeans.fit(features_scaled)

print("Labels:", kmeans.labels_)
centers = kmeans.cluster_centers_
print("Cluster Centers:", centers)
print(centers.shape)

test_pred = [9, 9, 6, 7, 8, 5] #true 3, pred 2

scaled_pred = scaler.transform([test_pred])

print("Predictions:", kmeans.predict(scaled_pred))
