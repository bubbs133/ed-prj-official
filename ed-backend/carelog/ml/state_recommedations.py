RECOMMENDATIONS = {
    0: {
        "state_name": "emotional distress + restriction",
        "general_statements": [
            "Hey, it seems like you've been under some stress, remember to take a moment of your day to stop, breath in and out, and remind yourself why you decided to take action. You've got this! 🤩",

        ],
        "conditions": {
            "stress_over_6": [
                "We've been seeing some stress levels go up, would you like some relaxation exercises?"
                ]
        }
    },
    1: {
        "state_name": "stable",
        "general_statements": [
            "Hey! In your recent check-in it seems like you've been keeping a stable rhythm, keep it up, you're doing amazing! 😃",
            "Whattt, I love to see this great pace, let's keep pushing, I know you've got this! 💪",
        ],
        "conditions": {
            "meals": [
                "I love to see that you've been giving yourself balanced nurishment, everyone deserves to feel energized."
            ]
        }
    },
    2: {
        "state_name": "burnout/numb",
        "general_statements": [
            "Lately we've been seeing some low energy, how's everything been going?",
            "",
        ]
    },
    3: {
        "state_name": "emotional distress + binge/overeating",
        "general_statements": [
            "",
            "",
        ],
        "conditions": {
            "meals": [
                "Looks like you've having some trouble with your eating, don't worry, this is perfectly normal during the recovery process."
            ]
        }
    },
}