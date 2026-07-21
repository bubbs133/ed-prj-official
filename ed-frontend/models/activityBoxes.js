import Colors from "../constants/colors";

const DAILY_ACTIVITIES = [
  {
    id: "quests",
    title: "Quests",
    description: "Challenge yourself and your mind by completing quests.",
    //color: Colors.pastelBlue,
    //border: Colors.darkBlue,
    color: Colors.seaBlue2,
    border: Colors.seaDarkBlue,
    fontColor: Colors.seaDarkBlue,
    img: require("../assets/icons/shell.png"),
    screen: "Quests",
  },
  /*{
    id: "chat",
    title: "Chatroom",
    description: "Have a chat with Izzy on eating disorders and nutrition.",
    color: Colors.greyish,
    border: Colors.secondMarineBlue,
    fontColor: Colors.secondMarineBlue,
    img: require("../assets/pinkbubbleoutline.png"),
    screen: "Chatbot",
  },
  {
    id: "carelog",
    title: "Care Log",
    description: "Gently observe yourself and your habits.",
    color: Colors.greyish,
    border: Colors.lightCoffeeBrown,
    fontColor: Colors.lightCoffeeBrown,
    img: require("../assets/icons/waves.png"),
    //screen: "Tracking",
    screen: "Assessment"
  },
  {
    id: "stickers",
    title: "Stickers",
    description: "Earn stickers for showing up!",
    color: Colors.greyish,
    border: Colors.lightCoffeeBrown,
    fontColor: Colors.lightCoffeeBrown,
    img: require("../assets/icons/waves.png"),
    //screen: "Tracking",
    screen: "StickersScreen",
  },*/
  {
    id: "journal",
    title: "Journal",
    description: "Set your thoughts and feelings free by journaling.",
    color: Colors.greyish,
    border: Colors.lightCoffeeBrown,
    fontColor: Colors.lightCoffeeBrown,
    img: require("../assets/icons/beachball.png"),
    screen: "Journal",
  },
  {
    id: "quickReads",
    title: "Quick Reads",
    description: "Learn about eating disorders, nutrition, and sport science!",
    color: Colors.seaDarkBlue,
    border: Colors.seaBlue2,
    fontColor: Colors.seaBlue2,
    img: require("../assets/icons/umbrella.png"),
    screen: "QuickReadsList",
  },
];

const CHECK_INS = [
  {
    id: "carelog",
    title: "Care Log",
    description: "Gently observe yourself and your habits.",
    color: Colors.limeGreen,
    border: Colors.marineBlue,
    fontColor: Colors.marineBlue,
    //img: require("../assets/foodgreen.png"),
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
