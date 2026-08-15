import { API_BASE_URL } from "@env";
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
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { journalPrompts } from "../models/journalPrompts";
import MainButton from "../components/MainButton";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import GoBack from "../components/GoBack";
import { AuthContext } from "../auth/auth-context";
import PrimaryBtn from "../components/PrimaryBtn";

const FREE_WRITE_PLACEHOLDER =
  "Write whatever's on your mind — no prompt, no structure. This is just for you.";
const PROMPTED_PLACEHOLDER =
  "Take a moment to ponder and express yourself through the prompt.";

function JournalScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  // "prompted" | "free_write"
  const [entryType, setEntryType] = useState("prompted");

  // Gentle, dismissible nudge shown after a flagged submission. Kept
  // separate from the success/error modals since it's an invitation, not
  // a confirmation or an error — it shouldn't feel like a popup you have
  // to deal with.
  const [reflectionPrompt, setReflectionPrompt] = useState(null);

  const authCtx = useContext(AuthContext);

  const [journalPrompt, setJournalPrompt] = useState("");
  const [entry, setEntry] = useState("");

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

  function switchTab(nextType) {
    setEntryType(nextType);
    setEntry("");
    setReflectionPrompt(null);
    if (nextType === "prompted") {
      const rndNum = generateRandomIndex();
      generateRndPrompt(rndNum);
    }
  }

  async function submitHandler() {
    try {
      const url = `${API_BASE_URL}/journal/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authCtx.token}`,
        },
        body: JSON.stringify({
          entry: entry,
          entry_type: entryType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.detail || "Journal submit failed");
      }

      setModalVisible(true);
      // Stash the gentle nudge (if any) so it can show once the success
      // modal is dismissed, instead of stacking two modals at once.
      if (result?.reflection_prompt) {
        setReflectionPrompt(result.reflection_prompt);
      }
    } catch (error) {
      console.log("JOURNAL ERROR:", error);
      setErrorModalVisible(true);
    }
  }

  const date = displayDate();
  const placeholder =
    entryType === "free_write" ? FREE_WRITE_PLACEHOLDER : PROMPTED_PLACEHOLDER;

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

          <View style={styles.tabRow}>
            <Pressable
              onPress={() => switchTab("prompted")}
              style={[styles.tab, entryType === "prompted" && styles.tabActive]}
            >
              <Text
                style={[
                  styles.tabText,
                  styles.globalFont,
                  entryType === "prompted" && styles.tabTextActive,
                ]}
              >
                Prompted
              </Text>
            </Pressable>
            <Pressable
              onPress={() => switchTab("free_write")}
              style={[
                styles.tab,
                entryType === "free_write" && styles.tabActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  styles.globalFont,
                  entryType === "free_write" && styles.tabTextActive,
                ]}
              >
                Free Write
              </Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollArea}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {entryType === "prompted" && (
              <Text style={[styles.prompt, styles.globalFont]}>
                {journalPrompt.prompt}
              </Text>
            )}
            <TextInput
              multiline={true}
              placeholder={placeholder}
              value={entry}
              onChangeText={(text) => setEntry(text)}
              style={[styles.journalEntryBox, styles.globalFont]}
            />
          </ScrollView>
          <PrimaryBtn buttonTitle={"Submit"} handler={submitHandler} />
        </View>
      </KeyboardAvoidingView>

      {/* Success modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Image
                style={{ width: 50, height: 50 }}
                source={require("../assets/icons/check.png")}
              />
            </View>
            <Text style={[styles.modalTitle, styles.globalFont]}>Awesome</Text>
            <Text style={[styles.modalText, styles.globalFont]}>
              Your journal entry has been successfully submitted.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                setEntry("");
                if (!reflectionPrompt) {
                  navigation.goBack();
                }
                // if there's a reflection prompt queued, stay on screen so
                // the soft nudge below can render instead of navigating away
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
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Image
                style={{ width: 50, height: 50 }}
                source={require("../assets/icons/exclaim.png")}
              />
            </View>
            <Text style={[styles.modalTitle, styles.globalFont]}>Uh oh!</Text>
            <Text style={[styles.modalText, styles.globalFont]}>
              Journal entry not submitted, please try again.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setErrorModalVisible(false);
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
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Gentle reflection nudge — a soft banner, not a blocking modal.
          Deliberately low-pressure: easy to dismiss, framed as an
          invitation, never appears alongside the success modal. */}
      {!modalVisible && reflectionPrompt && (
        <View style={styles.nudgeContainer}>
          <View style={styles.nudgeCard}>
            <Text style={[styles.nudgeText, styles.globalFont]}>
              {reflectionPrompt}
            </Text>
            <View style={styles.nudgeActions}>
              <TouchableOpacity
                onPress={() => {
                  setReflectionPrompt(null);
                  navigation.goBack();
                }}
              >
                <Text style={[styles.nudgeDismiss, styles.globalFont]}>
                  Not now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nudgeCta}
                onPress={() => {
                  setReflectionPrompt(null);
                  // Adjust the route name to whatever your Distortion
                  // Breaker screen is registered as in the navigator.
                  navigation.navigate("DistortionBreaker");
                }}
              >
                <Text
                  style={[
                    styles.nudgeCtaText,
                    { fontFamily: "Afacad", fontSize: 16, letterSpacing: 0.5 },
                  ]}
                >
                  Let's try it
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  header: {
    paddingBottom: 10,
  },
  tabRow: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    color: "#8A8A8A",
  },
  tabTextActive: {
    color: Colors.darkNeutral,
    fontWeight: "600",
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
    borderRadius: 10,
    paddingHorizontal: 40,
    paddingVertical: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.seaBlue2,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 15,
    marginTop: 15,
  },
  nudgeContainer: {
    position: "absolute",
    bottom: 20,
    left: "5%",
    right: "5%",
  },
  nudgeCard: {
    backgroundColor: "#FFF7F0",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  nudgeText: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 12,
  },
  nudgeActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 16,
  },
  nudgeDismiss: {
    fontSize: 15,
    color: "#8A8A8A",
  },
  nudgeCta: {
    backgroundColor: Colors.seaBlue2,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  nudgeCtaText: {
    color: "white",
  },
});

export default JournalScreen;
