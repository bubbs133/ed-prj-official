import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import Colors from "../constants/colors";
import GoBack from "../components/GoBack";

function StressScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <View style={[styles.contentContainer]}>
            <View>
              <GoBack navigation={navigation} />
            </View>
            <View>
              <View>
                <Text style={[styles.globalFont, styles.heading]}>
                  Stress Insights
                </Text>
                <View style={styles.scoreContainer}>
                  <Text style={[styles.globalFont, styles.score]}>4.5</Text>
                  <Text style={[styles.globalFont, styles.ten]}>out of 10</Text>
                </View>
              </View>
              <View style={styles.sections}>
                <View style={styles.section}>
                  <Text style={[styles.globalFont, styles.subtitles]}>
                    General Insights
                  </Text>
                  <Text style={styles.globalFont}>
                    Lorem Ipsum is dummy text of typescript industry. Lorem
                    Ipsum has been the industry's standard dummy, been the
                    industry's standard dummy
                  </Text>
                </View>
                <View style={styles.section}>
                  <Text style={[styles.globalFont, styles.subtitles]}>
                    Trends
                  </Text>
                  <Text style={styles.globalFont}>
                    Lorem Ipsum is dummy text of typescript industry. Lorem
                    Ipsum has been the industry's standard dummy, been the
                    industry's standard dummy
                  </Text>
                </View>
                <View style={styles.section}>
                  <Text style={[styles.globalFont, styles.subtitles]}>
                    Friendly Suggestions
                  </Text>
                  <Text style={styles.globalFont}>
                    Lorem Ipsum is dummy text of typescript industry. Lorem
                    Ipsum has been the industry's standard dummy.
                    <View style={styles.suggestions}>
                      <View style={styles.suggestion}>
                        <Text style={[styles.globalFont, styles.subtitles]}>
                          Dive into this read
                        </Text>
                        <Text style={styles.globalFont}>
                          Lorem Ipsum is dummy text of typescript industry.
                        </Text>
                      </View>
                      <View style={styles.suggestion}>
                        <Text style={[styles.globalFont, styles.subtitles]}>
                          Dive into this read
                        </Text>
                        <Text style={styles.globalFont}>
                          Lorem Ipsum is dummy text of typescript industry.
                        </Text>
                      </View>
                      <View style={styles.suggestion}>
                        <Text style={[styles.globalFont, styles.subtitles]}>
                          Dive into this read
                        </Text>
                        <Text style={styles.globalFont}>
                          Lorem Ipsum is dummy text of typescript industry.
                        </Text>
                      </View>
                    </View>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.seaBlue2,
  },
  contentContainer: {
    paddingHorizontal: "5%",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
  heading: {
    fontWeight: 500,
    fontSize: 20,
    textAlign: "center",
  },
  scoreContainer: {
    //backgroundColor: "#93B3C2",
    //borderRadius: 300 / 2,
   // height: 170,
    //width: 170,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 25
  },
  sections: {
    gap: 20,
  },
  score: {
    fontWeight: 500,
    fontSize: 80,
    textAlign: "center",
  },
  ten: {
    textAlign: "center",
    marginTop: -15,
  },
  subtitles: {
    fontWeight: 500,
    fontSize: 17,
  },
  suggestions: {
    gap: 15,
    paddingTop: 20
  },
  suggestion: {
    backgroundColor: "#93B3C2",
    borderRadius: 14,
    padding: 10
  }
});

export default StressScreen;
