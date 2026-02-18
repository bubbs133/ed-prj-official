import {
  Button,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import MainButton from "../components/MainButton";
import { useState } from "react";

function BotIntro({ navigation }) {
  const [isChecked, setIsChecked] = useState(false);

  function continueHandler() {
    if (isChecked) {
      navigation.navigate("ChatbotRoom");
    } else {
      Alert.alert(
        "Please check box to continue",
        "Please read the statements before continuing."
      );
    }
  }
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={[styles.heading, styles.globalFont]}>
            Izzy the Chatbot
          </Text>
          <Text style={[styles.p, styles.globalFont]}>
            Izzy is intended a provide general guidance on eating disorders such
            as what they are, symptoms, and potential steps one can take as a
            start to their recovery journey.{"\n"}
          </Text>
          <View>
            <View>
              <View style={styles.introinfo}>
                <View style={styles.introPoint}>
                  <Text style={[styles.miniheadings, styles.globalFont]}>
                    Understand Eating Disorders
                  </Text>
                  <Text style={[styles.globalFont]}>
                    Take a deeper look at what eating disorders are and how can
                    they can direct your lifestyle regardless of your
                    background.
                  </Text>
                </View>
                <View style={styles.introPoint}>
                  <Text style={[styles.miniheadings, styles.globalFont]}>
                    Nutrition Guidance
                  </Text>
                  <Text style={[styles.globalFont]}>
                    Learn about nutrition and gently promote healthy eating
                    patterns.
                  </Text>
                </View>
                <View style={styles.introPoint}>
                  <Text style={[styles.miniheadings, styles.globalFont]}>
                    Connection to professional support
                  </Text>
                  <Text style={[styles.globalFont]}>
                    Understand the many different professional resources that
                    are available to support you.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={[styles.p, styles.globalFont]}>
            This chatbot is{" "}
            <Text style={[styles.boldUnderline, styles.globalFont]}>
              not a replacement
            </Text>{" "}
            to professional medical advice or care. If you think you are in a
            life threatening situation immediately contact your local emergency
            room.
            {"\n"}
          </Text>
          <Text style={[styles.heading, styles.globalFont]}>
            Suicide & Crisis Lifeline
          </Text>
          <Text style={[styles.p, styles.globalFont]}>
            Professional help is always at your reach, if you are experiencing a
            crisis contact the Suicide and Crisis Lifeline.{"\n"}
          </Text>
          <Text style={[styles.p, styles.globalFont]}>
            For residents in the{" "}
            <Text style={[styles.boldUnderline, styles.globalFont]}>
              US & Canada
            </Text>{" "}
            call or text 988. For{" "}
            <Text style={[styles.boldUnderline, styles.globalFont]}>
              international residents
            </Text>{" "}
            visit Lifeline International and contact your country's local
            lifeline.
          </Text>
          {/*<Pressable style={styles.loginBtn} onPress={continueHandler}>
            <Text style={[styles.globalFont]}>Call 988</Text>
          </Pressable>
          <Pressable style={styles.loginBtn} onPress={continueHandler}>
            <Text style={[styles.globalFont]}>Text 988</Text>
          </Pressable>*/}
          <View style={styles.checkBoxSection}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? Colors.checkBoxColor : undefined}
            />
            <Text style={[styles.statement, styles.globalFont]}>
              I'm confirming I understand the statements above and choose to
              move forward.
            </Text>
          </View>
          <MainButton buttonTitle={"Continue"} handler={continueHandler} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  contentContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  introPoint: {
    paddingBottom: 10,
  },
  introinfo: {
    paddingBottom: 15,
  },
  p: {
    fontSize: 16,
  },
  heading: {
    fontSize: 20,
    justifyContent: "flex-start",
    fontWeight: 500,
  },
  miniheadings: {
    fontSize: 17,
    fontWeight: 500,
  },
  boldUnderline: {
    fontWeight: 700,
    textDecorationLine: "underline",
  },
  checkBoxSection: {
    flexDirection: "row",
    gap: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  checkbox: {
    marginTop: 3,
  },
  statement: {
    marginTop: -5,
    paddingRight: "10%",
  },
});

export default BotIntro;
