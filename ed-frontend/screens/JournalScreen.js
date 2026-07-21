import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { journalPrompts } from "../models/journalPrompts";
import MainButton from "../components/MainButton";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import GoBack from "../components/GoBack";
import { AuthContext } from "../auth/auth-context";

function JournalScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const authCtx = useContext(AuthContext);

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
    try {
      const url = "http://127.0.0.1:8000/journal/";
      //const url = "http://192.168.0.125:8000/journal/";
      let result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authCtx.token}`,
        },
        body: JSON.stringify({
          entry: entry,
        }),
      });
      result = await result.json();
      if (result) {
        console.log("Entry added", result);
        setModalVisible(!modalVisible);
      }
    } catch (error) {
      console.log("Error:", error);
      //setModalVisible(modalVisible);
      setErrorModalVisible(!errorModalVisible);
      //Alert.alert("Entry not added", "Please try again");
    }
  }

  const date = displayDate();
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.mainWrapper}>
          <View style={styles.header}>
            <GoBack navigation={navigation} />
            <View>
              <Text style={[styles.date, styles.globalFont]}>{date[0]}</Text>
              <Text style={[styles.globalFont]}>{date[1]}</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollArea}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Text style={[styles.prompt, styles.globalFont]}>
              {journalPrompt.prompt}
            </Text>
            <TextInput
              multiline={true}
              placeholder="Take a moment to ponder and express yourself through the prompt."
              onChangeText={(entry) => setEntry(entry)}
              style={[styles.journalEntryBox, styles.globalFont]}
            />
          </ScrollView>
          <View style={styles.footer}>
            <PrimaryButton
              style={styles.submitbtn}
              buttonTitle={"Submit"}
              handler={submitHandler}
              border={"transparent"}
              fill={Colors.lightCoffeeBrown}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Text style={{ fontSize: 50 }}>✨</Text>
            </View>
            <Text style={[styles.modalTitle, styles.globalFont]}>
              Awesome
            </Text>
            <Text style={[styles.modalText, styles.globalFont]}>
              Your journal entry has been successfully submitted.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.goBack();
              }}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { fontFamily: "Afacad", fontSize: 19, letterSpacing: 0.5 },
                ]}
              >
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={errorModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Text style={{ fontSize: 50 }}>❌</Text>
            </View>
            <Text style={[styles.modalTitle, styles.globalFont]}>
              Uh oh!
            </Text>
            <Text style={[styles.modalText, styles.globalFont]}>
              Journal entry not submitted, please try again.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setErrorModalVisible(false);
                //navigation.goBack();
              }}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { fontFamily: "Afacad", fontSize: 19, letterSpacing: 0.5 },
                ]}
              >
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  header: {
    paddingBottom: 10,
  },
  scrollArea: {
    flex: 1,
  },
  journalEntryBox: {
    flex: 1,
    minHeight: 200,
    textAlignVertical: "top",
    paddingTop: 10,
    fontSize: 18,
  },
  footer: {
    paddingVertical: 20,
    justifyContent: "flex-end",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
  date: {
    fontWeight: "500",
    fontSize: 20,
  },
  prompt: {
    paddingBottom: 20,
    marginTop: 15,
    fontSize: 16,
  },
  submitbtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Dims the screen
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: Colors.darkNeutral,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default JournalScreen;
