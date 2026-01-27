STATE_PROFILES = {
    0: {  #stable
        "urge_intensity": 2,
        "binge_urge": 1,
        "restriction_urge": 3,
        "emotional_distress": 2,
        "stress_level": 3,
        "energy_level": 7,
    },

    1: {  #emotional distress + restriction
        "urge_intensity": 6,
        "binge_urge": 2,
        "restriction_urge": 9,
        "emotional_distress": 9,
        "stress_level": 8,
        "energy_level": 4,   # anxious = activated
    },

    2: {  #emotional distress + binge/overeating
        "urge_intensity": 7,
        "binge_urge": 8,
        "restriction_urge": 3,
        "emotional_distress": 7,
        "stress_level": 8,
        "energy_level": 6,   # still activated
    },

    #3: {  #binge + guilt cycle
    #    "urge_intensity": 8,
    #    "binge_urge": 9,
    #    "restriction_urge": 6,  # rebound restriction
    #    "emotional_distress": 8,
    #    "stress_level": 5,
    #    "energy_level": 5,
    #},

    3: {  #burnout/being numb
        "urge_intensity": 4,
        "binge_urge": 3,
        "restriction_urge": 3,
        "emotional_distress": 4,
        "stress_level": 5,
        "energy_level": 2,
    }
}
