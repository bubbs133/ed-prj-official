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
import { useState, useEffect, useContext } from "react";
import Boxes from "../components/Boxes";
import Colors from "../constants/colors";
import { AuthContext } from "../auth/auth-context";
import { DAILY_ACTIVITIES } from "../models/activityBoxes";
import { colors } from "react-native-swiper-flatlist/src/themes";

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
  energy_level: { positive: true, unit: "/10", format: (avg) => `${avg}/10` },
  sleep_hours: { positive: true, unit: "hrs", format: (avg) => `${avg} hrs` },
  num_meals: { positive: true, unit: "/day", format: (avg) => `${avg}/day` },
  exercise_minutes: {
    positive: true,
    unit: "min",
    format: (avg) => `${avg} min`,
  },
};

function HomeScreen({ navigation }) {
  const [weeklyInsights, setWeeklyInsights] = useState(null);
  const [weeklyInsightsError, setWeeklyInsightsError] = useState(null);
  const [weeklyInsightsLoading, setWeeklyInsightsLoading] = useState(true);
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

    return positiveFeatures.reduce((best, [key, data]) => {
      const average = data.average ?? -Infinity;
      if (!best || average > best.average) {
        return { key, data, average };
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

  const journeyCards = [
    {
      key: "biggestImprovement",
      img: require("../assets/icons/seastar.png"),
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

      backgroundColor: Colors.seaDarkBlue,
      fontColor: Colors.darkBlueText,
    },
    {
      key: "strongestHabit",
      img: require("../assets/icons/sun.png"),
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
      title: "Full Insights",
      subtitle: "See more",
      value: weeklyInsights?.entries_count
        ? `${weeklyInsights.entries_count} entries`
        : "",
      screen: "GeneralInsights",
      backgroundColor: Colors.seaBlue2,
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
      //const url = `${API_BASE_URL}/weekly-insights/`;

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

  useEffect(() => {
    if (authCtx.token) {
      fetchWeeklyInsights();
    }
  }, [authCtx.token]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <View>
            <Text style={[styles.introText, styles.globalFont]}>Hi there!</Text>
            <View>
              <Text style={[styles.date, styles.globalFont]}>
                {date[1]}, {date[0]}{" "}
              </Text>
              <Text style={[styles.globalFont, styles.introPhrase]}>
                Whether you fell yesterday, fall today or tomorrow, remember
                that every day is a another opportunity to try again.{"\n"}
              </Text>
            </View>
          </View>
          <View style={styles.activityBoxes}>
            <View style={styles.activitySection}>
              <Text style={[styles.sectionHeading, styles.globalFont]}>
                Check-In
              </Text>
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => navigation.navigate("Assessment")}
              >
                <Boxes
                  style={[styles.resourcesBox]}
                  itemTitle="Care Log"
                  description="Gently observe yourself and your habits."
                  imgPath={require("../assets/icons/waterblue.png")}
                  height={110}
                  width={"100%"}
                  borderColor={null}
                  fillColor={Colors.seaBlue2}
                  fontColor={Colors.darkBlueText}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.activitySection}>
              <Text style={[styles.sectionHeading, styles.globalFont]}>
                Your Journey This Week
              </Text>

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
                    <Image source={card.img} style={styles.insightImg} />
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
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            {/*<View style={styles.activitySection}>
              <Text style={[styles.sectionHeading, styles.globalFont]}>
                Check-In
              </Text>
              <Pressable
                style={{ width: "100%" }}
                onPress={() => {
                  setActiveModal(!activeModal);
                }}
              >
                <Boxes
                  style={[styles.resourcesBox]}
                  itemTitle="Care Log"
                  description="Gently observe yourself and your habits."
                  imgPath={require("../assets/toolbox.png")}
                  height={110}
                  width={"100%"}
                  borderColor={Colors.marineBlue}
                  fillColor={Colors.limeGreen}
                  fontColor={Colors.marineBlue}
                />
              </Pressable>
            </View>*/}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    //backgroundColor: "red",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  topContainer: {
    paddingHorizontal: "5%",
  },
  date: {
    fontSize: 17,
    letterSpacing: 1,
  },
  introPhrase: {
    fontSize: 15,
    letterSpacing: 1,
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
    //gap: 100,
    //marginLeft: "5%",
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
    //paddingHorizontal: 10,
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
});

export default HomeScreen;
