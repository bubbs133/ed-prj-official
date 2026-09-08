// foodStudioData.js
// Static content. Recipe/lesson copy is placeholder — swap in
// dietitian-reviewed content before shipping.

export const BUILDER_STEPS = [
  {
    key: "base",
    label: "Pick a base",
    sub: "the cozy foundation",
    options: [
      { id: "pasta", label: "Pasta", emoji: "🍝" },
      { id: "rice", label: "Rice", emoji: "🍚" },
      { id: "potatoes", label: "Potatoes", emoji: "🥔" },
      { id: "bread", label: "Bread", emoji: "🍞" },
    ],
  },
  {
    key: "protein",
    label: "Pick a protein",
    sub: "for staying power",
    options: [
      { id: "chicken", label: "Chicken", emoji: "🍗" },
      { id: "tofu", label: "Tofu", emoji: "🧊" },
      { id: "beans", label: "Beans", emoji: "🫘" },
      { id: "eggs", label: "Eggs", emoji: "🥚" },
    ],
  },
  {
    key: "colorful",
    label: "Pick something colorful",
    sub: "for the fun of it",
    options: [
      { id: "spinach", label: "Spinach", emoji: "🥬" },
      { id: "tomatoes", label: "Tomatoes", emoji: "🍅" },
      { id: "peppers", label: "Peppers", emoji: "🫑" },
      { id: "broccoli", label: "Broccoli", emoji: "🥦" },
    ],
  },
  {
    key: "sauce",
    label: "Pick a sauce",
    sub: "the thing that ties it together",
    options: [
      { id: "pesto", label: "Pesto", emoji: "🌿" },
      { id: "tomato", label: "Tomato", emoji: "🍅" },
      { id: "creamy", label: "Creamy", emoji: "🥛" },
      { id: "tahini", label: "Tahini", emoji: "🫙" },
    ],
  },
  {
    key: "extra",
    label: "Add something fun",
    sub: "totally optional, just delight",
    options: [
      { id: "cheese", label: "Cheese", emoji: "🧀" },
      { id: "herbs", label: "Herbs", emoji: "🌱" },
      { id: "crispy", label: "Crispy topping", emoji: "✨" },
      { id: "none", label: "Skip this one", emoji: "🤍" },
    ],
  },
];

export const MOOD_ADJECTIVE = {
  pasta: "Cozy",
  rice: "Warming",
  potatoes: "Hearty",
  bread: "Simple",
};

export const SAUCE_NOTE = {
  pesto: "bright, herby",
  tomato: "warm, tangy",
  creamy: "smooth, comforting",
  tahini: "nutty, earthy",
};

export function buildMealName(picks) {
  const adj = MOOD_ADJECTIVE[picks.base] || "Cozy";
  const sauceLabel =
    BUILDER_STEPS[3].options.find((o) => o.id === picks.sauce)?.label || "";
  const colorLabel =
    BUILDER_STEPS[2].options.find((o) => o.id === picks.colorful)?.label || "";
  const baseLabel =
    BUILDER_STEPS[0].options.find((o) => o.id === picks.base)?.label || "";
  return `${adj} ${sauceLabel} ${colorLabel} ${baseLabel}`
    .replace(/\s+/g, " ")
    .trim();
}

export const LESSONS = [
  {
    id: "satisfied",
    emoji: "🍝",
    title: "Why does pasta make me feel satisfied?",
    teaser: "A little bit about carbohydrates and energy.",
    body: "Carbohydrates are your body's preferred, fastest source of fuel — they break down into glucose, which your brain and muscles run on. That settled, satisfied feeling after a bowl of pasta isn't your imagination — it's your body recognizing it just got easy, usable energy. Carbs aren't something to be earned or minimized. They're a basic, steady source of fuel your body relies on every single day.",
  },
  {
    id: "filling",
    emoji: "🥣",
    title: "What makes a meal filling?",
    teaser: "Carbs, protein, fat, and fiber all play a part.",
    body: "Fullness isn't one ingredient's job. Carbohydrates give quick energy, protein helps you feel steady for longer, fat slows digestion so fullness lingers, and fiber adds volume and helps things move along comfortably. Meals that feel the most satisfying usually have a few of these working together — which is exactly why 'balanced' doesn't mean restrictive. It means variety on the plate.",
  },
  {
    id: "fats",
    emoji: "🥑",
    title: "Let's talk about fats",
    teaser: "Why dietary fat matters, without the fear.",
    body: "Fat has been unfairly villainized. It cushions your organs, helps you absorb vitamins A, D, E, and K, keeps hormones functioning, and — practically speaking — is a big part of why food tastes good and meals feel satisfying. There's no version of a nourished body that doesn't include fat. It's not something to work around; it's something to include.",
  },
  {
    id: "no-cook",
    emoji: "🍞",
    title: "What can I do when I don't feel like cooking?",
    teaser: "Low-effort ways to still take care of yourself.",
    body: "Some days, cooking isn't available to you, and that's okay — eating doesn't require a full production. Toast with eggs, yogurt with granola and berries, a wrap with whatever's in the fridge — these all count as real, whole meals. Effort is not the measure of whether food 'counts.' Nourishment on a low-energy day still counts.",
  },
];

export const RECIPES = [
  {
    id: "tomato-spinach-pasta",
    name: "Creamy Tomato Spinach Pasta",
    moods: ["cozy", "comforting"],
    emoji: "🍝",
    ingredients: [
      "Pasta",
      "Tomato sauce",
      "Spinach",
      "A splash of cream or milk",
      "Parmesan",
    ],
    steps: [
      "Cook pasta until tender.",
      "Warm the tomato sauce, stir in a splash of cream, and let the spinach wilt into it.",
      "Toss with the pasta and top with parmesan and black pepper.",
    ],
    note: "A cozy, simple meal with a mix of carbohydrates, protein, fats, and micronutrients.",
  },
  {
    id: "toast-eggs-fruit",
    name: "Toast, Eggs & Fruit Plate",
    moods: ["quick", "no-cook-ish", "breakfast-y"],
    emoji: "🍳",
    ingredients: ["Bread", "Eggs", "Butter or oil", "A piece of fruit"],
    steps: [
      "Toast the bread.",
      "Cook the eggs however sounds good.",
      "Plate everything alongside the fruit.",
    ],
    note: "Ready in about ten minutes, no fuss required.",
  },
  {
    id: "yogurt-bowl",
    name: "Yogurt, Granola & Berries",
    moods: ["quick", "no-cook", "fresh", "breakfast-y"],
    emoji: "🍓",
    ingredients: ["Yogurt", "Granola", "Berries", "A drizzle of honey"],
    steps: [
      "Layer yogurt, granola, and berries in a bowl.",
      "Drizzle with honey if you'd like.",
    ],
    note: "No cooking, no dishes, still a full little meal.",
  },
  {
    id: "sesame-rice-bowl",
    name: "Sesame Veggie Rice Bowl",
    moods: ["comforting", "flavorful"],
    emoji: "🍜",
    ingredients: [
      "Rice",
      "Tofu or egg",
      "Peppers or broccoli",
      "Sesame oil",
      "Sesame seeds",
    ],
    steps: [
      "Cook the rice.",
      "Sauté the vegetables and tofu or egg with a little sesame oil.",
      "Combine and finish with sesame seeds.",
    ],
    note: "Warm, savory, and easy to make with whatever vegetables you have.",
  },
  {
    id: "pesto-toast",
    name: "Pesto White Bean Toast",
    moods: ["quick", "flavorful"],
    emoji: "🫘",
    ingredients: ["Bread", "White beans", "Pesto", "A squeeze of lemon"],
    steps: [
      "Toast the bread.",
      "Mash the beans with pesto and lemon.",
      "Spread generously on the toast.",
    ],
    note: "Bright and herby — ready in five minutes.",
  },
  {
    id: "potato-bowl",
    name: "Roasted Potato & Egg Bowl",
    moods: ["cozy", "comforting"],
    emoji: "🥔",
    ingredients: ["Potatoes", "Eggs", "Herbs", "A little cheese"],
    steps: [
      "Roast or pan-fry the potatoes until golden.",
      "Top with a fried or soft-boiled egg.",
      "Finish with herbs and cheese.",
    ],
    note: "Hearty and warm — great for a slower evening.",
  },
];

export const MOOD_TAGS = [
  { id: "cozy", label: "Cozy", emoji: "☕" },
  { id: "quick", label: "Quick", emoji: "🥪" },
  { id: "flavorful", label: "Flavorful", emoji: "🌶️" },
  { id: "fresh", label: "Fresh", emoji: "🍓" },
  { id: "comforting", label: "Comforting", emoji: "🍜" },
  { id: "breakfast-y", label: "Breakfast-y", emoji: "🥞" },
  { id: "no-cook", label: "No-cook", emoji: "🧺" },
];

export const EXPLORER_PROMPTS = [
  {
    id: "chili-eggs",
    emoji: "🌶️",
    text: "Add chili crisp to eggs",
    why: "a little heat on something familiar",
  },
  {
    id: "berries-oatmeal",
    emoji: "🫐",
    text: "Add berries to oatmeal",
    why: "a burst of sweetness and color",
  },
  {
    id: "pesto-veg",
    emoji: "🌿",
    text: "Add pesto to roasted vegetables",
    why: "herby richness on something plain",
  },
  {
    id: "sesame-rice",
    emoji: "🧂",
    text: "Add sesame seeds to rice",
    why: "a little crunch and nuttiness",
  },
];

export const DECIDE_MOODS = [
  { id: "cozy", label: "Something cozy", emoji: "🥣" },
  { id: "quick", label: "Something easy", emoji: "🥪" },
  { id: "comforting", label: "Something warm", emoji: "🍜" },
  { id: "fresh", label: "Something fresh", emoji: "🍓" },
  { id: "flavorful", label: "Something fun", emoji: "🍕" },
  { id: "unsure", label: "I have no idea", emoji: "🤷" },
];
