import numpy as np
import pandas as pd

import latent_states, state_profiles

np.random.seed(42)
user_samples = 100
features = list(state_profiles.STATE_PROFILES[0].keys())

data = []

for user_id in range(user_samples):
    state = np.random.choice([0, 1, 2, 3], p=[0.25, 0.25, 0.25, 0.25])
    profile = state_profiles.STATE_PROFILES[state]

    user_row = {"latent_state": state}

    for feature in features:
        value = np.random.normal(
            loc=profile[feature],
            scale=1.6
        )

        value = np.clip(value, 0, 10)
        user_row[feature] = round(value, 0)

    data.append(user_row)

df = pd.DataFrame(data)
#print(df)

csv_file = df.to_csv("testing_data_scale1_6.csv", index=False)