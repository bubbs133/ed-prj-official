import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { quests } from "../models/quests";
import React, { useState } from "react";
import ImagePicker from "../components/ImagePicker";
import GoBack from "../components/GoBack";

function SelectedQuestScreen({ route, navigation }) {
  const [summary, setSummary] = useState("");

  const { questId } = route.params;

  const quest = quests.find((q) => q.id === questId);

  if (!quest) return <Text>Quest not found</Text>;

  async function questSubmitHandler() {
    try {
      const url = "http://127.0.0.1:8000/?/";
      let result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: summary,
        }),
      });
      result = await result.json();
      if (result) {
        console.log("Quest recorded", result);
        setSummary("");
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Quest not recorded", "Please try again");
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View>
          <GoBack navigation={navigation} />
        </View>
        <View style={styles.mainContentContainer}>
          <Text style={[styles.globalFont, styles.questInfo]}>
            {quest.name}
          </Text>
          <Text style={[styles.globalFont, styles.questInfo]}>
            {quest.description}
          </Text>
          <View style={styles.imgsContainer}>
            <View style={styles.imgs}>
              <ImagePicker rotation={[{ rotate: "-5deg" }]} />
              <ImagePicker rotation={[{ rotate: "5deg" }]} />
            </View>
            <View style={styles.imgs}>
              <ImagePicker rotation={[{ rotate: "5deg" }]} />
              <ImagePicker rotation={[{ rotate: "-5deg" }]} />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={[styles.globalFont, styles.question]}>How'd it go?</Text>
            <TextInput
              style={[styles.globalFont, styles.textInput]}
              multiline={true}
              keyboardType="default"
              onChangeText={(entry) => setSummary(entry)}
            />
          </View>
          <Pressable style={styles.submitBtnContainer} onPress={questSubmitHandler}>
            <Text style={[styles.globalFont, styles.done]}>Done!</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

//const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    //alignItems: "flex-start",
    //justifyContent: "flex-start",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  mainContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    //addingHorizontal: "5%",
  },
  questInfo: {
    textAlign: "center",
  },
  imgsContainer: {
    rowGap: 30,
    paddingTop: 35,
    paddingBottom: 35,
  },
  imgs: {
    flexDirection: "row",
    columnGap: 50,
  },
  inputContainer: {
    //width: "100%",
    borderColor: "#dedede",
    borderWidth: 2,
    width: "90%",
    height: "20%",
    borderRadius: 10,
  },
  question: {
    fontSize: 16,
    paddingLeft: 7,
    paddingTop: 5,
    fontWeight: 500,
  },
  submitBtnContainer: {
    paddingTop: "10%"
  },
  done: {
    fontWeight: 500,
    fontSize: 17
  }
  /*textInput: {
    borderColor: "#dedede",
    borderWidth: 2,
    width: "90%",
    height: "40%",
  },*/
});

export default SelectedQuestScreen;
