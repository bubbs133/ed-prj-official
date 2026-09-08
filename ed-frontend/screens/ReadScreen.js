import { SafeAreaView } from "react-native-safe-area-context";
import { QUICK_READS } from "../models/reads";

import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import GoBack from "../components/GoBack";
import { useState } from "react";

import Colors from "../constants/colors";

export default function ReadScreen({ route, navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { width, height } = useWindowDimensions();

  const { readId } = route.params;

  const read = QUICK_READS.find((r) => r.id === readId);

  if (!read) {
    return <Text>Read not found</Text>;
  }

  const sections = read.sections;

  // Total pages = sections + completion page
  const totalPages = sections.length + 1;

  const isComplete = currentIndex === sections.length;

  const currentSection = sections[currentIndex];

  const contentWidth = Math.min(width, 760);

  // ==================================================
  // NAVIGATION
  // ==================================================

  const goNext = () => {
    if (currentIndex < sections.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  // ==================================================
  // COMPLETION PAGE
  // ==================================================

  if (isComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.contentContainer,
            {
              width: contentWidth,
            },
          ]}
        >
          <GoBack navigation={navigation} />

          <View style={styles.completeContainer}>
            <Text style={styles.completeTitle}>You've finished this read!</Text>

            <Text style={styles.completeText}>
              Thank you for taking a few moments to learn and care for yourself.
            </Text>

            <Text style={styles.completeText}>
              Recovery is built one small step at a time, and learning is one of
              those steps.
            </Text>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.doneButtonText}>Back to Quick Reads</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==================================================
  // NORMAL READ PAGE
  // ==================================================

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.contentContainer,
          {
            width: contentWidth,
          },
        ]}
      >
        <GoBack navigation={navigation} />

        {/* Progress */}
        <Text style={styles.progress}>
          {currentIndex + 1} / {totalPages}
        </Text>

        {/* Reading content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.readSubtitle}>{currentSection.subtitle}</Text>

          {currentSection.paragraphs.map((paragraph, i) => (
            <Text key={i} style={styles.readContent}>
              {paragraph}
            </Text>
          ))}
        </ScrollView>

        {/* Navigation buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, styles.backButton]}
            onPress={goPrevious}
          >
            <Text style={styles.navButtonText}>← Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={goNext}
          >
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ==================================================
  // PAGE
  // ==================================================

  container: {
    flex: 1,

    width: "100%",

    alignItems: "center",

    backgroundColor: Colors.bgColor,
  },

  contentContainer: {
    flex: 1,

    maxWidth: 760,

    backgroundColor: Colors.bgColor,

    paddingHorizontal: 30,
    paddingTop: 30,

    paddingBottom: 25,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,

    elevation: 3,
  },

  // ==================================================
  // PROGRESS
  // ==================================================

  progress: {
    textAlign: "center",

    fontSize: 15,

    paddingTop: 15,

    marginBottom: 5,

    fontFamily: "Afacad",

    letterSpacing: 1,

    color: Colors.lightGrey,
  },

  // ==================================================
  // READING CONTENT
  // ==================================================

  scrollContent: {
    paddingTop: 25,

    paddingBottom: 30,

    paddingHorizontal: 5,
  },

  readSubtitle: {
    fontSize: 25,

    fontFamily: "Afacad",

    fontWeight: "500",

    letterSpacing: 1,

    marginBottom: 20,

    color: Colors.darkNeutral,
  },

  readContent: {
    fontSize: 20,

    fontFamily: "Afacad",

    letterSpacing: 1,

    marginBottom: 20,

    lineHeight: 30,

    color: Colors.darkNeutral,
  },

  // ==================================================
  // NAVIGATION BUTTONS
  // ==================================================

  navigationButtons: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingTop: 15,

    paddingHorizontal: 5,
  },

  navButton: {
    paddingVertical: 12,

    paddingHorizontal: 22,

    borderRadius: 14,
  },

  backButton: {
    backgroundColor: "#EEEEEE",
  },

  nextButton: {
    backgroundColor: Colors.seaBlue2,
  },

  navButtonText: {
    fontSize: 16,

    fontFamily: "Afacad",

    fontWeight: "500",

    color: Colors.darkNeutral,

    letterSpacing: 0.5,
  },

  nextButtonText: {
    fontSize: 16,

    fontFamily: "Afacad",

    fontWeight: "600",

    color: Colors.darkNeutral,

    letterSpacing: 0.5,
  },

  // ==================================================
  // COMPLETION
  // ==================================================

  completeContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 35,
  },

  completeTitle: {
    fontSize: 28,

    fontFamily: "Afacad",

    fontWeight: "700",

    textAlign: "center",

    color: Colors.darkNeutral,

    marginBottom: 20,
  },

  completeText: {
    fontSize: 18,

    fontFamily: "Afacad",

    letterSpacing: 1,

    textAlign: "center",

    color: Colors.darkNeutral,

    marginBottom: 18,

    lineHeight: 28,

    maxWidth: 600,
  },

  doneButton: {
    marginTop: 25,

    backgroundColor: Colors.seaBlue2,

    paddingVertical: 14,

    paddingHorizontal: 28,

    borderRadius: 15,
  },

  doneButtonText: {
    fontSize: 17,

    fontFamily: "Afacad",

    fontWeight: "600",

    color: Colors.darkNeutral,

    letterSpacing: 1,
  },
});
