import numpy as np
import pandas as pd

np.random.seed(42)
num_samples = 200

def generate_data():
    data = {
        'num_meals': np.random.randint(0, 5, num_samples),
        'avg_mood_pre_meal': np.random.randint(0, 11, num_samples),
        'avg_mood_post_meal': np.random.randint(0, 11, num_samples),
        'avg_mood_day': np.random.randint(0, 11, num_samples),
        'stress_level': np.random.randint(0, 11, num_samples),
        'anxiety_level': np.random.randint(0, 11, num_samples),
        'exercise_amount_hr': np.random.uniform(0, 7, num_samples)
    }

    tracking_df = pd.DataFrame(data)
    #print(tracking_df)
    print(tracking_df[0:5])

generate_data()