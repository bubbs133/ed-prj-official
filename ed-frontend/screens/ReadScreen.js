import { SafeAreaView } from "react-native-safe-area-context";
import { QUICK_READS } from "../models/reads";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import GoBack from "../components/GoBack";
import { useState } from "react";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import Colors from "../constants/colors";

export default function ReadScreen({ route, navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { readId } = route.params;

  const read = QUICK_READS.find((r) => r.id === readId);

  if (!read) return <Text>Read not found</Text>;

  const sections = read.sections;

  // Add one extra page for the completion screen
  const pages = [
    ...sections,
    {
      isComplete: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <GoBack navigation={navigation} />

        {/*<Text style={styles.progress}>
          {currentIndex === sections.length
            ? "Finished!"
            : `${currentIndex + 1} / ${sections.length}`}
        </Text>*/}

        <SwiperFlatList
          horizontal
          showPagination={false}
          data={pages}
          keyExtractor={(_, index) => index.toString()}
          onChangeIndex={({ index }) => setCurrentIndex(Math.round(index))}
          renderItem={({ item }) => {
            if (item.isComplete) {
              return (
                <View style={styles.page}>
                  <View style={styles.completeContainer}>
                    <Text style={styles.completeTitle}>
                      You've finished this read!
                    </Text>

                    <Text style={styles.completeText}>
                      Thank you for taking a few moments to learn and care for
                      yourself.
                    </Text>

                    <Text style={styles.completeText}>
                      Recovery is built one small step at a time, and learning
                      is one of those steps.
                    </Text>

                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={styles.doneButtonText}>
                        Back to Quick Reads
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }

            return (
              <View style={styles.page}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  <Text style={styles.readSubtitle}>{item.subtitle}</Text>

                  {item.paragraphs.map((paragraph, i) => (
                    <Text key={i} style={styles.readContent}>
                      {paragraph}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "5%",
  },

  progress: {
    textAlign: "center",
    fontSize: 17,
    paddingBottom: "8%",
    fontFamily: "Afacad",
    letterSpacing: 1,
  },

  page: {
    width: width * 0.9,
    height: height * 0.8,

  },

  scrollContent: {
    paddingBottom: 80,
    marginTop: "10%"
  },

  readSubtitle: {
    fontSize: 25,
    fontFamily: "Afacad",
    fontWeight: "500",
    letterSpacing: 1,
    marginBottom: 20,
  },

  readContent: {
    fontSize: 20,
    fontFamily: "Afacad",
    letterSpacing: 1,
    marginBottom: 20,
  },

  completeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    marginTop: "-45%"
  },

  emoji: {
    fontSize: 50,
    marginBottom: 15,
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
