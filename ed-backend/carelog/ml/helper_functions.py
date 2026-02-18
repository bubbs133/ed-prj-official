import numpy as np
from .loader_gmm_model import v2_gmm_model, v2_gmm_scaler
from .v2_state_names import STATE_NAMES

from .state_recommedations import RECOMMENDATIONS
import random

def cluster_user(data):
    x = np.array([[
        data["urge_intensity"],
        data["binge_urge"],
        data["restriction"],
        data["emotional_distress"],
        data["stress_level"],
        data["energy_level"],
        data["sleep_hours"],
        data["num_meals"],
        data["exercise_minutes"],
    ]])

    scaler = v2_gmm_scaler
    x_scaled = scaler.transform(x)

    cluster = int(v2_gmm_model.predict(x_scaled)[0])
    state_name = STATE_NAMES.get(cluster, "unknown")

    return cluster, state_name

def get_recommendations(cluster):
    recomms = RECOMMENDATIONS
    recom_list = []

    if cluster == 0: #emotional distress + restriction
        print("cluster 0/ed + restriction")
        #if features["stress"] > 6:
        #    recom_list.append(random.choice(recomms["stress_over_6"]))
    if cluster == 1: #stable
        print("cluster 1/stable")
    if cluster == 2: #burnout/being numb
        print("cluster 1/burnout/being numb")
    if cluster == 3: #emotional distress + binge/overeating
        print("cluster 1/emotional distress + binge/overeating")

    #return recom_list
    return