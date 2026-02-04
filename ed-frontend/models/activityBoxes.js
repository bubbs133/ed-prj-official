import Colors from "../constants/colors";

const DAILY_ACTIVITIES = [
  {
    id: "quests",
    title: "Quests",
    description: "Challenge yourself and your mind by completing quests.",
    color: Colors.lightBlue,
    border: Colors.darkBlue,
    img: require("../assets/staroutline.png"),
    screen: "Quests",
  },
  {
    id: "chat",
    title: "Chatroom",
    description: "Chat with Izzy to understand eating disorders and nutrition.",
    color: Colors.lightPink,
    border: Colors.darkPink,
    img: require("../assets/pinkbubbleoutline.png"),
    screen: "Chatbot",
  },
  {
    id: "journal",
    title: "Journal",
    description: "Set your thoughts and feelings free by journaling.",
    color: Colors.lightGreen,
    border: Colors.darkGreen,
    img: require("../assets/greenbook.png"),
    screen: "Journal",
  },
  {
    id: "dyk",
    title: "Did you know",
    description: "Challenge yourself and your mind by completing quests.",
    color: Colors.lightBrown,
    border: Colors.darkBrown,
    img: require("../assets/staroutline.png"),
    screen: "Quests",
  },
];

const CHECK_INS = [
  {
    id: "carelog",
    title: "Care Log",
    description: "Gently observe yourself.",
    color: Colors.lightGreen,
    border: Colors.darkGreen,
    img: require("../assets/foodgreen.png"),
    screen: "Tracking",
  },
  /*{
    id: "assessment",
    title: "Self-Assessment",
    description: "Take the self-assessment to check in on your symptoms.",
    color: Colors.lightPink,
    border: Colors.darkPink,
    img: require("../assets/quizpink.png"),
    screen: "Assessment",
  },*/
];

export { DAILY_ACTIVITIES, CHECK_INS };
