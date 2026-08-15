import { API_BASE_URL } from "@env";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  ImageBackground,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useState, useContext } from "react";
import { CARELOG_QUESTIONS } from "../models/carelogQuestions";
import { assessment } from "../models/assessment";
import SecondButton from "../components/SecondButton";
import GoBack from "../components/GoBack";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../auth/auth-context";

function AssessmentScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  // Gentle, dismissible nudge shown after a flagged reflection (question
  // index 9, the "what did you learn from your care log today?" free
  // text). Same pattern as JournalScreen — kept separate from the
  // success/error modals since it's an invitation, not a confirmation.
  const [reflectionPrompt, setReflectionPrompt] = useState(null);

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  const canMoveForward =
    answers[currentQuestionIdx] &&
    answers[currentQuestionIdx].trim().length > 0;

  const authCtx = useContext(AuthContext);

  function nextQuestionHandler() {
    if (currentQuestionIdx < CARELOG_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  }

  function prevQuestionHandler() {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  }

  async function submitHandler() {
    try {
      const url = `${API_BASE_URL}/care-log-cluster/`;

      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authCtx.token}`,
        },
        body: JSON.stringify({
          urge_intensity: Number(answers[0]),
          binge_urge: Number(answers[1]),
          restriction: Number(answers[2]),
          emotional_distress: Number(answers[3]),
          stress_level: Number(answers[4]),
          energy_level: Number(answers[5]),
          sleep_hours: Number(answers[6]),
          num_meals: Number(answers[7]),
          exercise_minutes: Number(answers[8]),
          notes: answers[9],
        }),
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data?.detail || "Care log submit failed");
      }

      setModalVisible(true);
      // Stash the gentle nudge (if any) so it can render once the success
      // modal is dismissed, instead of stacking two things on the user
      // at once.
      if (data?.reflection_prompt) {
        setReflectionPrompt(data.reflection_prompt);
      }
    } catch (error) {
      console.log("CARELOG ERROR:", error);
      setErrorModalVisible(true);
    }
  }

  const currentQuestion = CARELOG_QUESTIONS[currentQuestionIdx];

  const lastQuestion = currentQuestionIdx === CARELOG_QUESTIONS.length - 1;
  const firstQuestion = currentQuestionIdx === 0;
  const isLast = currentQuestionIdx === CARELOG_QUESTIONS.length - 1;

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.mainContainer}>
          <View style={styles.top}>
            <GoBack navigation={navigation} />
          </View>
          <Text style={[styles.numQuestions, styles.globalFont]}>
            {currentQuestionIdx + 1} / {CARELOG_QUESTIONS.length}
          </Text>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingTop: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.questions, styles.globalFont]}>
              {currentQuestion.question}
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.globalFont,
                isLast && {
                  fontSize: 24,
                  textAlignVertical: "top",
                  textAlign: "left",
                },
              ]}
              keyboardType={isLast ? "default" : "decimal-pad"}
              multiline={isLast}
              caretHidden={false}
              cursorColor={Colors.darkNeutral}
              selectionColor={Colors.darkNeutral}
              value={answers[currentQuestionIdx] || ""}
              onChangeText={(text) => {
                setAnswers((prev) => ({
                  ...prev,
                  [currentQuestionIdx]: text,
                }));
              }}
            />
          </ScrollView>

          <View style={styles.footer}>
            <View style={{ width: 80 }}>
              {!firstQuestion && (
                <Pressable onPress={prevQuestionHandler}>
                  <Text style={[styles.btnTitle, styles.globalFont]}>Back</Text>
                </Pressable>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.btn,
                !canMoveForward && !firstQuestion && { opacity: 0.5 },
              ]}
              onPress={isLast ? submitHandler : nextQuestionHandler}
              disabled={!canMoveForward}
            >
              <Text style={[styles.btnTitle, styles.globalFont]}>
                {isLast ? "Done!" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
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
            <Text style={[styles.modalTitle, styles.globalFont]}>Awesome!</Text>
            <Text style={[styles.modalText, styles.globalFont]}>
              Your care log has been successfully submitted.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (!reflectionPrompt) {
                  navigation.navigate("TabNav");
                }
                // if there's a reflection prompt queued, stay on this
                // screen so the soft nudge below can render instead of
                // navigating away immediately
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
              Care log not submitted, please try again.
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
          Only appears once the success modal has been dismissed, and
          only if the analyzer actually flagged something in the
          reflection text. */}
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
                  navigation.navigate("TabNav");
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
    backgroundColor: "#FAF8F4",
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    textAlign: "center",
    fontSize: 150, // Huge for numbers
    color: Colors.darkNeutral,
    paddingTop: "20%",
  },
  footer: {
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {},
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
    borderRadius: 10,
    paddingHorizontal: 40,
    paddingVertical: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
  numQuestions: {
    fontSize: 18,
    textAlign: "center",
  },
  questions: {
    fontSize: 24,
    textAlign: "center",
  },
  btnTitle: {
    color: "white",
    fontSize: 20,
  },
  modalIconContainer: {
    marginBottom: 20,
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

export default AssessmentScreen;
