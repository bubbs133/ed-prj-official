import { API_BASE_URL } from "@env";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Boxes from "../components/Boxes";
import Colors from "../constants/colors";
import { AuthContext } from "../auth/auth-context";
import { DAILY_ACTIVITIES } from "../models/activityBoxes";
import { MESSAGES } from "../models/messages";

const FEATURE_CONFIGS = {
  urge_intensity: {
    positive: false,
    unit: "/10",
    format: (avg) => `${avg}/10`,
  },
  binge_urge: { positive: false, unit: "/10", format: (avg) => `${avg}/10` },
  restriction: { positive: false, unit: "/10", format: (avg) => `${avg}/10` },
  emotional_distress: {
    positive: false,
    unit: "/10",
    format: (avg) => `${avg}/10`,
  },
  stress_level: { positive: false, unit: "/10", format: (avg) => `${avg}/10` },
  energy_level: {
    positive: true,
    unit: "/10",
    target: 10,
    format: (avg) => `${avg}/10`,
  },
  sleep_hours: {
    positive: true,
    unit: "hrs",
    target: 8,
    format: (avg) => `${avg} hrs`,
  },
  num_meals: {
    positive: true,
    unit: "/day",
    target: 3,
    format: (avg) => `${avg}/day`,
  },
  exercise_minutes: {
    positive: true,
    unit: "min",
    target: 60,
    format: (avg) => `${avg} min`,
  },
};

function HomeScreen({ navigation }) {
  const [weeklyInsights, setWeeklyInsights] = useState(null);
  const [weeklyInsightsError, setWeeklyInsightsError] = useState(null);
  const [weeklyInsightsLoading, setWeeklyInsightsLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState(null);
  const [topMessage, setTopMessage] = useState("");
  const authCtx = useContext(AuthContext);

  // ****** DISPLAY DATE ****** //
  function displayDate() {
    const today = new Date();
    const month = today.toLocaleDateString("en-US", { month: "long" });
    const dayNumber = today.getDate();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

    const formattedDate = `${month} ${dayNumber}`;
    const dayNameFormatted = `${dayName}`;

    return [formattedDate, dayNameFormatted];
  }
  const date = displayDate();

  // ****** DISPLAY MESSAGE ****** //
  function generateRandomIndex() {
    const rndNum = Math.floor(Math.random() * MESSAGES.length);
    return rndNum;
  }

  function generateRndPrompt(rndNum) {
    setTopMessage(MESSAGES[rndNum]);
  }

  useEffect(() => {
    const rndNum = generateRandomIndex();
    generateRndPrompt(rndNum);
  }, []);

  const featureScreenMap = {
    stress_level: "StressScreen",
    energy_level: "EnergyScreen",
    num_meals: "MealsScreen",
    sleep_hours: "SleepScreen",
    exercise_minutes: "ExerciseScreen",
    emotional_distress: "EmotionalDistressScreen",
    restriction: "RestrictionScreen",
    binge_urge: "BingeScreen",
    urge_intensity: "UrgeScreen",
  };

  const formatFeatureValue = (featureKey, average) => {
    const config = FEATURE_CONFIGS[featureKey];
    if (!config || average === null || average === undefined) return "-";
    return config.format(average);
  };

  const hasEnoughData = () => {
    return weeklyInsights?.entries_count >= 1;
  };

  const isImprovement = (featureKey, featureData) => {
    const config = FEATURE_CONFIGS[featureKey];
    if (!config || !featureData) return false;
    if (config.positive) {
      return featureData.trend_direction === "↑";
    }
    return featureData.trend_direction === "↓";
  };

  const getStrongestHabit = () => {
    const featureEntries = Object.entries(weeklyInsights?.features || {});

    const positiveFeatures = featureEntries.filter(
      ([key]) => FEATURE_CONFIGS[key]?.positive,
    );

    if (!positiveFeatures.length) return null;

    // Normalize each feature against its own target so metrics on different
    // scales (e.g. exercise minutes vs energy /10) are comparable.
    return positiveFeatures.reduce((best, [key, data]) => {
      const target = FEATURE_CONFIGS[key]?.target || 1;
      const average = data.average ?? -Infinity;
      const score = average === -Infinity ? -Infinity : average / target;
      if (!best || score > best.score) {
        return { key, data, average, score };
      }
      return best;
    }, null);
  };

  const getBiggestImprovement = () => {
    const featureEntries = Object.entries(weeklyInsights?.features || {});
    const improvements = featureEntries
      .map(([key, data]) => ({
        key,
        data,
        magnitude: data?.trend_value ?? 0,
        improvement: isImprovement(key, data),
      }))
      .filter((item) => item.data && item.magnitude > 0);

    const improved = improvements
      .filter((item) => item.improvement)
      .sort((a, b) => b.magnitude - a.magnitude);

    if (improved.length) return improved[0];

    return improvements.sort((a, b) => b.magnitude - a.magnitude)[0] || null;
  };

  const FOCUS_THRESHOLDS = {
    stress_level: 5,
    emotional_distress: 5,
    restriction: 5,
    binge_urge: 5,
    urge_intensity: 5,
  };
  const getGentleFocus = () => {
    const features = weeklyInsights?.features;

    if (!features) return null;

    const possibleFocus = [
      "stress_level",
      "emotional_distress",
      "restriction",
      "binge_urge",
      "urge_intensity",
    ];

    for (const key of possibleFocus) {
      const feature = features[key];

      if (feature && feature.average >= FOCUS_THRESHOLDS[key]) {
        return {
          key,
          data: feature,
        };
      }
    }

    return null;
  };

  const strongestHabit = getStrongestHabit();
  const biggestImprovement = getBiggestImprovement();
  const gentleFocus = getGentleFocus();

  // Weekly rollup of the journal/care-log NLP analysis, combined across
  // both sources (see journal/nlp.py + carelog/views.py::_build_language_insight).
  // Renders whenever there's at least one entry this week — "tone" tells
  // us whether to show it as a gentle flag, an encouraging note, or a
  // neutral check-in. A good week gets surfaced just as much as a hard one.
  const languageInsight = weeklyInsights?.language_insight;
  const hasLanguageSignal =
    !!languageInsight &&
    languageInsight.tone !== "no_data" &&
    !!languageInsight.message;

  const LANGUAGE_TONE_STYLES = {
    flagged: {
      background: "#FFF7F0",
      icon: require("../assets/icons/fish.png"),
      titleColor: Colors.darkBrownText,
      title: "Language Check-In",
    },
    positive: {
      background: "#EAF6EF",
      icon: require("../assets/icons/sun.png"),
      titleColor: Colors.darkBlueText,
      title: "Noticing Something Good",
    },
    neutral: {
      background: "#F0F0F0",
      icon: require("../assets/icons/seastar.png"),
      titleColor: Colors.darkNeutral,
      title: "Language Check-In",
    },
  };
  const languageToneStyle =
    LANGUAGE_TONE_STYLES[languageInsight?.tone] || LANGUAGE_TONE_STYLES.neutral;

  const journeyCards = [
    {
      key: "biggestImprovement",
      img: require("../assets/icons/seastar.png"),
      imgColor: Colors.darkBlueText,
      title: "Biggest Improvement",

      subtitle: biggestImprovement?.key
        ? biggestImprovement.key.replace("_", " ")
        : "",

      value:
        biggestImprovement?.data?.average !== undefined
          ? formatFeatureValue(
              biggestImprovement.key,
              biggestImprovement.data.average,
            )
          : "More data needed.",

      screen: biggestImprovement?.key
        ? featureScreenMap[biggestImprovement.key]
        : null,

      disabled: !biggestImprovement,

      backgroundColor: Colors.greyish,
      fontColor: Colors.darkBlueText,
    },
    {
      key: "strongestHabit",
      img: require("../assets/icons/sun.png"),
      imgColor: Colors.darkBrownText,
      title: "Strongest Habit",
      subtitle: strongestHabit?.data?.label || "",
      value:
        strongestHabit?.average !== undefined
          ? formatFeatureValue(strongestHabit.key, strongestHabit.average)
          : "More data needed.",
      screen:
        strongestHabit?.key && featureScreenMap[strongestHabit.key]
          ? featureScreenMap[strongestHabit.key]
          : null,
      disabled: !strongestHabit,
      backgroundColor: Colors.greyish,
      fontColor: Colors.darkBrownText,
    },
    {
      key: "gentleFocus",
      img: require("../assets/icons/fish.png"),
      imgColor: Colors.darkBrownText,
      title: "Gentle Focus",

      subtitle: gentleFocus?.key ? gentleFocus.key.replace("_", " ") : "",

      value:
        gentleFocus?.data?.average !== undefined
          ? formatFeatureValue(gentleFocus.key, gentleFocus.data.average)
          : "More data needed.",

      screen: gentleFocus?.key ? featureScreenMap[gentleFocus.key] : null,

      disabled: !gentleFocus,

      backgroundColor: Colors.greyish,
      fontColor: Colors.darkBrownText,
    },
    {
      key: "fullInsights",
      img: require("../assets/icons/bucket.png"),
      imgColor: Colors.darkBlueText,
      title: "Full Insights",
      subtitle: "See more",
      value: weeklyInsights?.entries_count
        ? `${weeklyInsights.entries_count} entries`
        : "",
      screen: "GeneralInsights",
      backgroundColor: Colors.homeBlue,
      fontColor: Colors.darkBlueText,
      whiteText: true,
    },
  ];

  async function fetchWeeklyInsights() {
    try {
      setWeeklyInsightsLoading(true);
      setWeeklyInsightsError(null);

      if (!authCtx.token) {
        throw new Error("Not authenticated");
      }
      const url = `${API_BASE_URL}/weekly-insights/`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Token ${authCtx.token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.detail || "Unable to fetch weekly insights.");
      }

      setWeeklyInsights(json);
    } catch (error) {
      setWeeklyInsightsError(error.message);
    } finally {
      setWeeklyInsightsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (authCtx.token) {
        fetchWeeklyInsights();
      }
    }, [authCtx.token]),
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <View style={styles.topContainerTwo}>
            <View style={styles.leftSide}>
              <Text style={[styles.introText, styles.globalFont]}>
                Welcome {authCtx.username}!
              </Text>

              <Text style={[styles.date, styles.globalFont]}>
                {date[1]}, {date[0]}
              </Text>

              <Text style={[styles.globalFont, styles.introPhrase]}>
                {topMessage.message}
              </Text>
            </View>

            <View style={styles.rightSide}>
              <Image
                source={require("../assets/main/ball.png")}
                style={styles.ballImg}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={{ paddingBottom: 23 }}>
            <Text style={[styles.sectionHeading, styles.globalFont]}>
              Your Journey This Week
            </Text>
            <View style={styles.dailyGrid}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, idx) => {
                  const checkedIn =
                    weeklyInsights?.check_in_days?.[day] ?? false;

                  return (
                    <View
                      key={idx}
                      style={[styles.dayBox, checkedIn && styles.checkedDayBox]}
                    >
                      <Text style={[styles.globalFont, styles.dayLabel]}>
                        {day}
                      </Text>

                      <Text style={[styles.globalFont, styles.dayValue]}>
                        {checkedIn ? "✓" : "—"}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          </View>

          {/* Language check-in — renders whenever there's at least one
              journal or care log entry this week, regardless of tone. A
              positive or neutral week gets its own gentle note instead of
              staying silent; only a "flagged" week is tappable through to
              the Distortion Breaker, since the others aren't asking for
              an action. */}
          {hasLanguageSignal && (
            <TouchableOpacity
              style={[
                styles.languageCard,
                { backgroundColor: languageToneStyle.background },
              ]}
              activeOpacity={languageInsight.tone === "flagged" ? 0.85 : 1}
              disabled={languageInsight.tone !== "flagged"}
              onPress={() => navigation.navigate("DistortionBreaker")}
            >
              <View style={styles.languageCardHeader}>
                <Image
                  source={languageToneStyle.icon}
                  style={[
                    styles.languageCardIcon,
                    { tintColor: languageToneStyle.titleColor },
                  ]}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.globalFont,
                    styles.languageCardTitle,
                    { color: languageToneStyle.titleColor },
                  ]}
                >
                  {languageToneStyle.title}
                </Text>
              </View>
              <Text style={[styles.globalFont, styles.languageCardText]}>
                {languageInsight.message}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.activityBoxes}>
            <View style={styles.activitySection}>
              <View style={styles.insightsGrid}>
                {journeyCards.map((card) => (
                  <TouchableOpacity
                    key={card.key}
                    disabled={card.disabled}
                    style={[
                      styles.insightCard,
                      { backgroundColor: card.backgroundColor },
                      card.disabled && styles.disabledCard,
                    ]}
                    onPress={() => {
                      if (!card.disabled && card.screen) {
                        navigation.navigate(card.screen);
                      }
                    }}
                  >
                    <Image
                      source={card.img}
                      style={[styles.insightImg, { tintColor: card.imgColor }]}
                    />
                    <Text
                      style={[
                        styles.globalFont,
                        styles.insightTitle,
                        { color: card.fontColor },
                      ]}
                    >
                      {card.title}
                    </Text>
                    <Text
                      style={[
                        styles.globalFont,
                        styles.insightMetric,
                        { color: card.fontColor },
                      ]}
                    >
                      {card.subtitle}
                    </Text>
                    <Text
                      style={[
                        styles.globalFont,
                        styles.insightValue,
                        card.whiteText && { color: card.fontColor },
                        { color: card.fontColor },
                      ]}
                    >
                      {card.value}
                    </Text>
                    {card.whiteText && (
                      <Text
                        style={[
                          styles.globalFont,
                          styles.insightSubtext,
                          { color: card.fontColor },
                        ]}
                      >
                        {card.subtitle ===
                        "View trends, recommendations, and progress"
                          ? "View trends, recommendations, and progress"
                          : ""}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.activitySection}>
              <Text style={[styles.sectionHeading, styles.globalFont]}>
                Daily Activities
              </Text>
              <FlatList
                scrollEnabled={false}
                data={DAILY_ACTIVITIES}
                numColumns={2}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ width: "48%" }}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <Boxes
                      itemTitle={item.title}
                      description={item.description}
                      imgPath={item.img}
                      height={154}
                      width={"100%"}
                      borderColor={item.border}
                      fillColor={item.color}
                      fontColor={item.fontColor}
                      imgTint={item.imgColor}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F4",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  topContainer: {
    paddingHorizontal: "5%",
    paddingBottom: "20%",
  },
  date: {
    fontSize: 17,
    letterSpacing: 1,
  },
  introPhrase: {
    fontSize: 15,
    letterSpacing: 1,
    paddingTop: 7,
  },
  disabledCard: {
    opacity: 1,
  },
  globalFont: {
    fontFamily: "Afacad",
    color: Colors.darkNeutral,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: 2,
    paddingBottom: 7,
  },
  activitySection: {
    paddingBottom: 15,
  },
  dashboardCards: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  introText: {
    fontSize: 23,
    letterSpacing: 2,
    fontWeight: 500,
  },
  section: {
    paddingBottom: 15,
  },
  headings: {
    fontWeight: 700,
    letterSpacing: 2,
    paddingBottom: 10,
    fontSize: 17,
    marginLeft: "5%",
  },
  scrollContent: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 20,
  },
  scrollItemPress: {
    flexDirection: "row",
    height: 170,
    width: 200,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.darkNeutral,
    opacity: 50,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  topCards: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  qaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  qaBox: {
    flex: 1,
    height: 90,
    backgroundColor: Colors.lightCoffeeBrown,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: -5,
  },

  qaText: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
    color: Colors.cream,
    textAlign: "center",
    marginTop: 15,
  },

  qaIcon: {
    width: 35,
    height: 35,
  },
  insightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  insightCard: {
    width: "48%",
    minHeight: 130,
    borderRadius: 18,
    padding: 14,
    justifyContent: "space-between",
  },

  insightImg: {
    height: 40,
    width: 40,
  },

  insightTitle: {
    fontSize: 17,
    fontFamily: "Afacad",
    fontWeight: 700,
    letterSpacing: 3,
  },

  insightMetric: {
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 1,
  },

  insightValue: {
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 1,
  },

  insightSubtext: {
    fontSize: 13,
    lineHeight: 18,
  },
  dailyGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayBox: {
    alignItems: "center",
    backgroundColor: "#93B3C2",
    borderRadius: 8,
    padding: 8,
    width: "13%",
  },
  dayLabel: {
    fontWeight: 600,
    fontSize: 11,
    marginBottom: 4,
    color: Colors.darkNeutral,
  },
  dayValue: {
    fontSize: 12,
    fontWeight: 600,
    color: Colors.darkNeutral,
  },
  topContainerTwo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 15,
    paddingRight: "10%",
  },
  leftSide: {
    flex: 1,
    paddingRight: 35,
  },
  rightSide: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  ballImg: {
    width: 140,
    height: 140,
    paddingTop: 40,
  },
  languageCard: {
    backgroundColor: "#FFF7F0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 23,
  },
  languageCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  languageCardIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
    tintColor: Colors.darkBrownText,
  },
  languageCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
    color: Colors.darkBrownText,
  },
  languageCardText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.darkNeutral,
  },
});

export default HomeScreen;
