import numpy as np
import pandas as pd

import v2_state_profiles

np.random.seed(42)

NUM_SAMPLES = 100
STATE_PROBS = [0.25, 0.25, 0.25, 0.25]

FEATURE_BOUNDS = {
    "urge_intensity": (0, 10),
    "binge_urge": (0, 10),
    "restriction_urge": (0, 10),
    "emotional_distress": (0, 10),
    "stress_level": (0, 10),
    "energy_level": (0, 10),
    "sleep_hours": (0, 12),
    "num_meals": (0, 6),
    "exercise_minutes": (0, 180),
}

# Extract feature list from profiles
FEATURES = list(next(iter(v2_state_profiles.STATE_PROFILES_TEST.values())).keys())

rows = []

for _ in range(NUM_SAMPLES):
    # Sample latent state
    state = np.random.choice(list(v2_state_profiles.STATE_PROFILES_TEST.keys()), p=STATE_PROBS)
    profile = v2_state_profiles.STATE_PROFILES_TEST[state]

    row = {"latent_state": state}

    for feature in FEATURES:
        mean, std = profile[feature]

        value = np.random.normal(mean, std)

        # Clip to realistic bounds
        min_val, max_val = FEATURE_BOUNDS[feature]
        value = np.clip(value, min_val, max_val)

        # Optional rounding (depends on feature)
        #if feature in ["num_meals"]:
        #    value = int(round(value))
        #elif feature in ["exercise_minutes"]:
        #    value = int(round(value))
        #else:
        #    value = round(value, 1)

        #value = np.clip(value, 0, 10)
        row[feature] = round(value, 1)

        #row[feature] = value

    rows.append(row)

df = pd.DataFrame(rows)

df.to_csv("v2_test_tracking_data.csv", index=False)

print(df.head())
