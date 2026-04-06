import { SafeAreaView } from "react-native-safe-area-context";
import { QUICK_READS } from "../models/reads";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
} from "react-native";
import GoBack from "../components/GoBack";
import { useEffect, useState, useRef } from "react";
import { SwiperFlatList } from "react-native-swiper-flatlist";

export default function ReadScreen({ route, navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { readId } = route.params;

  const read = QUICK_READS.find((r) => r.id === readId);

  const sections = read.sections;
  const currentSection = sections[currentIndex];

  if (!read) return <Text>Read not found</Text>;

  function handleNext() {
    if (currentIndex < sections.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // optional: go back or show "done"
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.contentContainer}>
        <View>
          <GoBack navigation={navigation} />
        </View>
        <View>
          <Text style={styles.progress}>
            {currentIndex + 1} / {sections.length}
          </Text>
        </View>
        <Pressable onPress={handleNext} style={{ flex: 1 }}>
          <View style={styles.questContainer}>
            <View style={styles.readContainer}>
              <Text style={styles.readSubtitle}>{currentSection.subtitle}</Text>

              <Text style={styles.readContent}>{currentSection.paragraph}</Text>
            </View>
          </View>
        </Pressable>
        {/*<SwiperFlatList
          autoplay={false}
          showPagination={false}
          data={read.sections}
          renderItem={({ item }) => (
            <View style={styles.questContainer}>
              <View style={styles.questCard}>
                <Text style={styles.questName}>
                  {item.subtitle ? item.subtitle : "name blank"}
                </Text>
                <Text style={styles.questText}>
                  {item ? item.paragraph : "description blank"}
                </Text>
              </View>
            </View>
          )}
        />*/}
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  container: {
    flex: 1,
  },
  progress: {
    textAlign: "center",
    fontSize: 17
  },
  readContainer: {
    rowGap: "50%"
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
  intro: {
    fontSize: 16,
  },
  paragraph: {
    fontSize: 16,
  },
  questContainer: {
    flex: 1,
    width,
  },
  questCard: {
    marginHorizontal: "5%",
  },
  readSubtitle: {
    fontSize: 25,
    fontFamily: "Afacad",
    fontWeight: 500,
    textAlign: "left",
    letterSpacing: 1
  },
  readContent: {
    fontFamily: "Afacad",
    //fontWeight: 400,
    letterSpacing: 1,
    fontSize: 20,
    paddingBottom: 20,
    textAlign: "left",
    justifyContent: "space-between"
  },
});
