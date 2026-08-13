import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import Colors from "../constants/colors";
import { Color } from "react-native-gifted-chat";

const AssessmentIntroScreen = ({ navigation }) => {
  const handleStart = () => {
    navigation.navigate("Assessment");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustration}>
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />
          <Text style={styles.wave}>༄</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, styles.globalFont]}>
            Take a moment to{"\n"}check in.
          </Text>

          <Text style={[styles.description, styles.globalFont]}>
            Take a few minutes to notice how you're feeling and what you're
            thinking today.
            {"\n\n"}
            There's no right or wrong answer. This space is simply here for you
            to reflect, without judgment.
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={[styles.buttonText, styles.globalFont]}>
              Start Care Log
            </Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, styles.globalFont]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AssessmentIntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F4",
  },
  globalFont: {
    fontFamily: "Afacad",
    color: Colors.darkNeutral,
  },
  content: {
    flex: 1,
    paddingHorizontal: "5%",
    paddingTop: 20,
    paddingBottom: 30,
    justifyContent: "space-between",
  },

  logo: {
    fontSize: 26,
    fontWeight: "600",
    letterSpacing: 1,
    color: Colors.primary || "#6F8F7A",
  },

  illustration: {
    alignSelf: "center",
    width: 170,
    height: 170,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  circleLarge: {
    position: "absolute",
    width: 145,
    height: 145,
    borderRadius: 73,
    backgroundColor: "#DAE9EF",
  },

  circleSmall: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#B8D1DC",
    opacity: 0.8,
  },

  wave: {
    fontSize: 34,
    color: Colors.landingBlue,
  },

  textContainer: {
    marginTop: -100,
  },

  title: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "600",
    color: "#30332F",
    letterSpacing: -1,
    marginBottom: 20,
  },

  description: {
    fontSize: 17,
    lineHeight: 25,
    color: "#777B75",
    maxWidth: 340,
  },

  bottomContainer: {
    alignItems: "center",
  },

  button: {
    width: "100%",
    height: 40,
    borderRadius: 18,
    backgroundColor: Colors.homeBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  arrow: {
    color: Color.darkNeutral,
    fontSize: 22,
    marginLeft: 10,
    marginTop: -2,
  },
});
