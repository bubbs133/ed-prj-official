class Quests {
    constructor(name, description, completed) {
        this.name = name;
        this.description = description;
        this.completed = completed;
    }
}

const quests = [
    new Quests("Safe Foods", "Add one new food or feared food to your plate.", false),
    new Quests("Self Gratitude", "Write down 3 things you are grateful of yourself.", false),
    new Quests("No Measuring", "Prepare and eat a meal without you having to count calories, macros, etc.", false),
    new Quests("Yellow Walk", "Go out for a slight walk and find 3 yellow things.", false),
    new Quests("Forgotten Hobby", "Spend 20 minutes of your day with a forgetten hobby.", false),
    new Quests("Music Time", "Listen to 2 - 3 of your favorite songs.", false)
]