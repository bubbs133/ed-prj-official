import { API_BASE_URL } from "@env";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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

// Accent theming for the three "story" stat cards — each gets its own
// soft-tint background + solid icon badge instead of one flat grey,
// so the row reads as three distinct signals rather than one grid.
const STAT_ACCENTS = {
  biggestImprovement: { bg: "#EAF6EF", accent: "#3F8F5F" },
  strongestHabit: { bg: "#FFF7E8", accent: "#C98A2E" },
  gentleFocus: { bg: "#FDEEEE", accent: "#C25B5B" },
};

function HomeScreen({ navigation }) {
  const [weeklyInsights, setWeeklyInsights] = useState(null);
  const [weeklyInsightsError, setWeeklyInsightsError] = useState(null);
  const [weeklyInsightsLoading, setWeeklyInsightsLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState(null);
  const [topMessage, setTopMessage] = useState("");
  const authCtx = useContext(AuthContext);

  // ****** SOS BUTTON PULSE ****** //
  // A quiet "still here if you need it" pulse rather than an alarm — see
  // the grounding toolkit prototype notes on keeping this reassuring,
  // not urgent-feeling, in color and motion.
  const sosPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sosPulse, {
          toValue: 1,
          duration: 1700,
          useNativeDriver: true,
        }),
        Animated.timing(sosPulse, {
          toValue: 0,
          duration: 1700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [sosPulse]);

  const sosGlowOpacity = sosPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0],
  });
  const sosGlowScale = sosPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });

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

  // ****** JOURNEY STAT CARDS ******
  // Three "story" cards (Biggest Improvement / Strongest Habit / Gentle
  // Focus) each get their own accent color and an icon badge, so they read
  // as three distinct signals rather than one uniform grid. "Full Insights"
  // is pulled out into its own wide banner below — it's a different kind
  // of thing (a link to more detail) than the other three (a stat), so it
  // shouldn't share a cell size with them.
  const statCards = [
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
          : null,
      screen: biggestImprovement?.key
        ? featureScreenMap[biggestImprovement.key]
        : null,
      disabled: !biggestImprovement,
      ...STAT_ACCENTS.biggestImprovement,
    },
    {
      key: "strongestHabit",
      img: require("../assets/icons/sun.png"),
      title: "Strongest Habit",
      subtitle:
        strongestHabit?.data?.label ||
        (strongestHabit?.key ? strongestHabit.key.replace("_", " ") : ""),
      value:
        strongestHabit?.average !== undefined
          ? formatFeatureValue(strongestHabit.key, strongestHabit.average)
          : null,
      screen:
        strongestHabit?.key && featureScreenMap[strongestHabit.key]
          ? featureScreenMap[strongestHabit.key]
          : null,
      disabled: !strongestHabit,
      ...STAT_ACCENTS.strongestHabit,
    },
    {
      key: "gentleFocus",
      img: require("../assets/icons/fish.png"),
      title: "Gentle Focus",
      subtitle: gentleFocus?.key ? gentleFocus.key.replace("_", " ") : "",
      value:
        gentleFocus?.data?.average !== undefined
          ? formatFeatureValue(gentleFocus.key, gentleFocus.data.average)
          : null,
      screen: gentleFocus?.key ? featureScreenMap[gentleFocus.key] : null,
      disabled: !gentleFocus,
      ...STAT_ACCENTS.gentleFocus,
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
                      <Text
                        style={[
                          styles.globalFont,
                          styles.dayLabel,
                          checkedIn && styles.checkedDayText,
                        ]}
                      >
                        {day}
                      </Text>

                      <Text
                        style={[
                          styles.globalFont,
                          styles.dayValue,
                          checkedIn && styles.checkedDayText,
                        ]}
                      >
                        {checkedIn ? "✓" : "—"}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          </View>

          {/* Food Studio entry point. Register the FoodStudioNavigator stack
              as a screen named "FoodStudio" in whatever navigator also owns
              "Home" (e.g. your root Stack.Navigator or tab navigator), with
              headerShown: false so its own stack header takes over:

                <Stack.Screen
                  name="FoodStudio"
                  component={FoodStudioNavigator}
                  options={{ headerShown: false }}
                />
          */}

          {/* Language check-in — renders whenever there's at least one
              journal or care log entry this week, regardless of tone. A
              positive or neutral week gets its own gentle note instead of
              staying silent; only a "flagged" week is tappable through to
              the Distortion Breaker, since the others aren't asking for
              an action. */}

          {/* SOS / grounding toolkit entry point. Always visible, not
              tucked into a menu — the whole point is that it's reachable
              in one tap during a hard moment. Navigates to the toolkit
              menu screen (Breathe / Bubbles / Release) built separately;
              register that screen in your navigator as "GroundingToolkit". 
          <View style={styles.sosWrap} pointerEvents="box-none">
            <Animated.View
              style={[
                styles.sosGlow,
                {
                  opacity: sosGlowOpacity,
                  transform: [{ scale: sosGlowScale }],
                },
              ]}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("Toolkit")}
              accessibilityRole="button"
              accessibilityLabel="Open grounding toolkit, I need help now"
              activeOpacity={0.9}
              style={styles.sosBtn}
            >
              <Text style={styles.sosLabel}>I need{"\n"}help now</Text>
            </TouchableOpacity>
          </View> */}

          <View style={styles.activityBoxes}>
            <View style={styles.activitySection}>
              <View style={styles.statsRow}>
                {statCards.map((card) => (
                  <TouchableOpacity
                    key={card.key}
                    disabled={card.disabled}
                    activeOpacity={0.85}
                    style={[
                      styles.statCard,
                      {
                        backgroundColor: card.disabled ? "#F6F5F4" : card.bg,
                        borderColor: card.disabled ? "#E6E2DF" : "transparent",
                        borderWidth: card.disabled ? 1.5 : 0,
                        borderStyle: card.disabled ? "dashed" : "solid",
                      },
                    ]}
                    onPress={() => {
                      if (!card.disabled && card.screen) {
                        navigation.navigate(card.screen);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.statIconBadge,
                        {
                          backgroundColor: card.disabled
                            ? "#E6E2DF"
                            : card.accent,
                        },
                      ]}
                    >
                      <Image
                        source={card.img}
                        style={[styles.statIconImg, { tintColor: "#fff" }]}
                      />
                    </View>

                    <Text style={[styles.globalFont, styles.statTitle]}>
                      {card.title}
                    </Text>

                    {card.disabled ? (
                      <Text style={[styles.globalFont, styles.statEmptyText]}>
                        More data needed
                      </Text>
                    ) : (
                      <>
                        {!!card.subtitle && (
                          <Text
                            style={[styles.globalFont, styles.statSubtitle]}
                          >
                            {card.subtitle}
                          </Text>
                        )}
                        <Text
                          style={[
                            styles.globalFont,
                            styles.statValue,
                            { color: card.accent },
                          ]}
                        >
                          {card.value}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.fullInsightsBanner}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("GeneralInsights")}
              >
                <View style={styles.fullInsightsIconBadge}>
                  <Image
                    source={require("../assets/icons/bucket.png")}
                    style={[
                      styles.fullInsightsIconImg,
                      { tintColor: Colors.homeBlue },
                    ]}
                  />
                </View>
                <View style={styles.fullInsightsTextWrap}>
                  <Text style={[styles.globalFont, styles.fullInsightsTitle]}>
                    Full Insights
                  </Text>
                  <Text
                    style={[styles.globalFont, styles.fullInsightsSubtitle]}
                  >
                    {weeklyInsights?.entries_count
                      ? `${weeklyInsights.entries_count} entries this week — view trends & patterns`
                      : "View trends, recommendations, and progress"}
                  </Text>
                </View>
                <Text style={styles.fullInsightsArrow}>→</Text>
              </TouchableOpacity>
              <View style={{paddingTop: 20}}>
                {hasLanguageSignal && (
                  <TouchableOpacity
                    style={[
                      styles.languageCard,
                      { backgroundColor: "#FFF7F0" },
                    ]}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate("GeneralInsights")}
                  >
                    <View style={styles.languageCardHeader}>
                      <View style={styles.languageCardIcon}>
                        <Image
                        source={languageToneStyle.icon}
                        style={[
                          { tintColor: languageToneStyle.titleColor, width: 22, height: 22 },
                        ]}
                        resizeMode="contain"
                      />
                      </View>
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
                      {languageInsight.summary || languageInsight.message}
                    </Text>
                    <Text
                      style={[styles.globalFont, styles.languageCardFootnote]}
                    >
                      Tap for a deeper breakdown of journal and care-log
                      reflections.
                    </Text>
                  </TouchableOpacity>
                )}
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
                columnWrapperStyle={styles.activityColumnWrapper}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.activityCard}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View
                      style={[
                        styles.activityIconBadge,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <Image
                        source={item.img}
                        style={[
                          styles.activityIconImg,
                          { tintColor: item.imgColor },
                        ]}
                        resizeMode="contain"
                      />
                    </View>
                    <Text
                      style={[
                        styles.globalFont,
                        styles.activityTitle,
                        { color: item.fontColor },
                      ]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[styles.globalFont, styles.activityDescription]}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
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
    width: "100%",
    alignItems: "center",
  },
  topContainer: {
    width: "100%",
    maxWidth: 760,
    flex: 1,
    backgroundColor: Colors.bgColor,
    paddingHorizontal: "5%",
    paddingBottom: "15%",
    paddingTop: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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

  // ****** DAILY ACTIVITIES (redesigned to match the stat cards above) ******
  activityColumnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  activityCard: {
    width: "48%",
    minHeight: 168,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 16,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  activityIconImg: {
    width: 22,
    height: 22,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
    lineHeight: 19,
  },
  activityDescription: {
    fontSize: 12.5,
    color: Colors.darkNeutral,
    opacity: 0.65,
    marginTop: 4,
    lineHeight: 17,
  },

  // ****** JOURNEY STAT CARDS (redesigned) ******
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    minHeight: 138,
    borderRadius: 20,
    padding: 14,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statIconImg: {
    width: 16,
    height: 16,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    opacity: 0.55,
  },
  statSubtitle: {
    fontSize: 12.5,
    fontWeight: "600",
    marginTop: 3,
    textTransform: "capitalize",
    opacity: 0.85,
  },
  statValue: {
    fontSize: 21,
    fontWeight: "800",
    marginTop: 6,
  },
  statEmptyText: {
    fontSize: 12.5,
    fontStyle: "italic",
    opacity: 0.5,
    marginTop: 6,
  },

  fullInsightsBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF2FB",
    borderRadius: 20,
    padding: 16,
  },
  fullInsightsIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  fullInsightsIconImg: {
    width: 22,
    height: 22,
  },
  fullInsightsTextWrap: {
    flex: 1,
  },
  fullInsightsTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  fullInsightsSubtitle: {
    fontSize: 12.5,
    opacity: 0.7,
    marginTop: 2,
    lineHeight: 17,
  },
  fullInsightsArrow: {
    fontSize: 18,
    color: Colors.homeBlue,
    marginLeft: 8,
  },

  // ****** FOOD STUDIO ENTRY CARD ******
  foodStudioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1E4",
    borderRadius: 20,
    padding: 16,
    marginBottom: 23,
  },
  foodStudioIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FBDCB9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  foodStudioIconText: {
    fontSize: 24,
  },
  foodStudioTextWrap: {
    flex: 1,
  },
  foodStudioTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  foodStudioSubtitle: {
    fontSize: 12.5,
    opacity: 0.7,
    marginTop: 2,
    lineHeight: 17,
  },
  foodStudioArrow: {
    fontSize: 20,
    opacity: 0.4,
    marginLeft: 8,
    color: Colors.darkNeutral,
  },

  dailyGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayBox: {
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    paddingVertical: 10,
    width: "13%",
  },
  checkedDayBox: {
    backgroundColor: Colors.homeBlue,
  },
  checkedDayText: {
    color: "#fff",
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
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
  languageCardFootnote: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.darkNeutral,
    opacity: 0.8,
  },
  sosWrap: {
    alignSelf: "center",
    width: 78,
    height: 78,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 23,
  },
  sosGlow: {
    position: "absolute",
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.homeBlue,
  },
  sosBtn: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.homeBlue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.homeBlue,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  sosLabel: {
    fontFamily: "Afacad",
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 15,
  },
});

export default HomeScreen;
