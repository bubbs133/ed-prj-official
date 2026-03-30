import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import { journalPrompts } from "../models/journalPrompts";
import MainButton from "../components/MainButton";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SecondButton from "../components/SecondButton";
import GoBack from "../components/GoBack";

function JournalScreen({ navigation }) {
  const [journalPrompt, setJournalPrompt] = useState("");
  const [entryAuthor, setEntryAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");

  function displayDate() {
    const today = new Date();
    const month = today.toLocaleDateString("en-US", { month: "long" });
    const dayNumber = today.getDate();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

    const formattedDate = `${month} ${dayNumber}`;
    const dayNameFormatted = `${dayName}`;

    return [formattedDate, dayNameFormatted];
  }

  function generateRandomIndex() {
    const rndNum = Math.floor(Math.random() * journalPrompts.length);
    return rndNum;
  }

  function generateRndPrompt(rndNum) {
    setJournalPrompt(journalPrompts[rndNum]);
  }

  useEffect(() => {
    const rndNum = generateRandomIndex();
    generateRndPrompt(rndNum);
  }, []);

  async function submitHandler() {
    console.log("workss");
    try {
      const url = "http://127.0.0.1:8000/journal/";
      //const url = "http://92.168.0.125/journal";
      let result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry: entry,
        }),
      });
      result = await result.json();
      if (result) {
        console.log("Entry added", result);
        setEntry("");
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Entry not added", "Please try again");
    }
  }

  const date = displayDate();
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={[styles.contentContainer]}>
          <View>
            <GoBack navigation={navigation} />
          </View>
          <View>
            <Text style={[styles.date, styles.globalFont]}>{date[0]}</Text>
            <Text style={[styles.globalFont]}>{date[1]}</Text>
          </View>
          <Text style={[styles.prompt, styles.globalFont]}>
            {journalPrompt.prompt}
          </Text>
          <TextInput
            multiline={true}
            placeholder="Take a moment to ponder and express yourself through the prompt."
            onChangeText={(entry) => setEntry(entry)}
            style={[styles.journalEntryBox, styles.globalFont]}
          ></TextInput>
          <SecondButton
            style={styles.submitbtn}
            buttonTitle={"Submit"}
            handler={submitHandler}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: Colors.lightNeutral,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },
  contentContainer: {
    //marginTop: "17%",
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
  journalEntryBox: {
    //borderColor: "#000",
    //borderWidth: 1,
    //width: "76%",
    height: "90%",
    minHeight: 150,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  date: {
    fontFamily: "Afacad",
    fontWeight: 500,
    fontSize: 20,
    //fontWeight: 500
  },
  prompt: {
    //paddingRight: "15%",
    paddingBottom: 20,
    marginTop: 15,
    fontSize: 16,
  },
  submitbtn: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default JournalScreen;
