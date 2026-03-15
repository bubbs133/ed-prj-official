class Quests {
  constructor(id, name, description, completed) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.completed = completed;
  }
}

const quests = [
  new Quests(
    "0",
    "Safe Foods",
    "Add one new food or feared food to your plate.",
    false
  ),
  new Quests(
    "1",
    "Self Gratitude",
    "Write down 3 things you are grateful of yourself.",
    false
  ),
  new Quests(
    "2",
    "No Measuring",
    "Prepare and eat a meal without you having to count calories, macros, etc.",
    false
  ),
  new Quests(
    "3",
    "Yellow Walk",
    "Go out for a slight walk and find 3 yellow things.",
    false
  ),
  new Quests(
    "4",
    "Forgotten Hobby",
    "Spend 20 minutes of your day with a forgetten hobby.",
    false
  ),
  new Quests("Music Time", "Listen to 2 - 3 of your favorite songs.", false),
];

export { quests };
