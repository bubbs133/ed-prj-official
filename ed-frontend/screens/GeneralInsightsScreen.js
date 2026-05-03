import { StyleSheet, Text, View, ScrollView, Dimensions, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBack from "../components/GoBack";
import React from "react";
import Colors from "../constants/colors";
import * as Progress from "react-native-progress";

const GeneralInsightsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <SafeAreaView edges={["top", "left", "right"]}>
          <View style={[styles.contentContainer]}>
            <View>
              <GoBack navigation={navigation} />
            </View>
            <View>
              <Text style={[styles.globalFont, styles.heading]}>
                General Insights
              </Text>
              <Text style={[styles.globalFont, styles.summary]}>
                Lorem Ipsum is dummy text of ..
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Text>
            </View>
            <View style={styles.bars}>
              <View style={styles.bar}>
                <View style={styles.barScore}>
                  <Text style={[styles.globalFont]}>Meals</Text>
                  <Text style={[styles.globalFont, styles.bold]}>2.5</Text>
                </View>
                <Progress.Bar progress={0.25} width={Dimensions.get("window")} />
              </View>
              <View style={styles.bar}>
                <View style={styles.barScore}>
                  <Text style={[styles.globalFont]}>Stress</Text>
                  <Text style={[styles.globalFont, styles.bold]}>2/10</Text>
                </View>
                <Progress.Bar progress={0.2} width={300} />
              </View>
              <View style={styles.bar}>
                <View style={styles.barScore}>
                  <Text style={[styles.globalFont]}>Restriction</Text>
                  <Text style={[styles.globalFont, styles.bold]}>6/10</Text>
                </View>
                <Progress.Bar progress={0.6} width={300} />
              </View>
            </View>
            <View>
              <Button title="Stress Screen" onPress={() => navigation.navigate("StressScreen")}/>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: Colors.lightCoffeeBrown,
  },
  contentContainer: {
    paddingHorizontal: "5%",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
  summary: {
    fontSize: 16,
  },
  /*bold: {
    fontWeight: 500,
    fontSize: 20,
  },*/
  bars: {
    flex: 1,
    flexDirection: "column",
  },
  bar: {
    marginBottom: 17,
    //width,
  },
  barScore: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
});

export default GeneralInsightsScreen;
