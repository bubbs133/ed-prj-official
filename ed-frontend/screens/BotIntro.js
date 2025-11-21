import {
  Button,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

function BotIntro({ navigation }) {
  function continueHandler() {
    navigation.navigate("Chatbot");
  }
  return (
    <SafeAreaView style={styles.container}>
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
                <Ionicons name="help-circle-outline" size={50}/>
                <View>
                  <Text style={[styles.miniheadings, styles.globalFont]}>
                    Understand Eating Disorders
                  </Text>
                  <Text style={[styles.globalFont]}>
                    Take a deeper look at what eating disorders are and how can
                    they can affect your lifestyle.
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View>
                <Text style={[styles.miniheadings, styles.globalFont]}>Nutrition Guidance</Text>
                <Text style={[styles.globalFont]}></Text>
              </View>
            </View>
            <View>
              <View>
                <Text style={[styles.miniheadings, styles.globalFont]}>
                  Connection to professional support
                </Text>
                <Text style={[styles.globalFont]}></Text>
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
            call or text 988.
          </Text>
          <Pressable style={styles.loginBtn} onPress={continueHandler}>
            <Text style={[styles.globalFont]}>Call 988</Text>
          </Pressable>
          <Pressable style={styles.loginBtn} onPress={continueHandler}>
            <Text style={[styles.globalFont]}>Text 988</Text>
          </Pressable>
          <Text style={[styles.p, styles.globalFont]}>
            For{" "}
            <Text style={[styles.boldUnderline, styles.globalFont]}>
              international residents
            </Text>{" "}
            visit Lifeline International and contact your country's local
            lifeline.
          </Text>
          <Button title="International Lifeline" color="#000"></Button>
          <Pressable style={styles.loginBtn} onPress={continueHandler}>
            <Text style={styles.loginBtnTitle}>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightNeutral,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: "7%",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  contentContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  introinfo: {
    flexDirection: "row"
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
    fontWeight: 500
  },
  boldUnderline: {
    fontWeight: 700,
    textDecorationLine: "underline",
  },
});

export default BotIntro;
