import { SafeAreaView } from "react-native-safe-area-context";
import { QUICK_READS } from "../models/reads";
import { Text, View, StyleSheet, Dimensions, ScrollView } from "react-native";
import GoBack from "../components/GoBack";
import { useEffect, useState, useRef } from "react";
import { SwiperFlatList } from "react-native-swiper-flatlist";

export default function ReadScreen({ route, navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { readId } = route.params;

  const read = QUICK_READS.find((r) => r.id === readId);

  if (!read) return <Text>Read not found</Text>;

  const sections = read.sections;
  const currentSection = sections[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View>
          <GoBack navigation={navigation} />
        </View>
        <View>
          <Text style={styles.progress}>
            {currentIndex + 1} / {sections.length}
          </Text>
        </View>
        <SwiperFlatList
          horizontal
          showPagination={false}
          index={0}
          //paginationStyleItem={{ width: 8, height: 8 }}
          //paginationStyleItemActive={{ width: 18 }}
          disableGesture={false}
          onChangeIndex={({ index }) => setCurrentIndex(index)}
          data={sections}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
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
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: "5%",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  page: {
    width: width * 0.9,
    flex: 1,
    height: height * 0.8
  },
  progress: {
    textAlign: "center",
    fontSize: 17,
    paddingBottom: "10%",
  },
  readContainer: {
    flex: 1,
    //rowGap: "5%",
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
  readSubtitle: {
    fontSize: 25,
    fontFamily: "Afacad",
    fontWeight: 500,
    textAlign: "left",
    letterSpacing: 1,
    paddingBottom: "5%",
  },
  readContent: {
    fontFamily: "Afacad",
    //fontWeight: 400,
    letterSpacing: 1,
    fontSize: 20,
    marginBottom: 20,
    textAlign: "left",
  },
});
