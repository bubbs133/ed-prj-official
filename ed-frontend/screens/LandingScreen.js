import { API_BASE_URL } from "@env";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  useWindowDimensions,
} from "react-native";
import { useState, useContext, useMemo } from "react";
import { CARELOG_QUESTIONS } from "../models/carelogQuestions";
import GoBack from "../components/GoBack";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../auth/auth-context";

// --- Validation helpers -----------------------------------------------

// Scale questions (0-5): must be a number 0-10, in 0.5 increments.
function validateScale(rawText) {
  const trimmed = rawText.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: null }; // empty just blocks progress, no error shown yet
  }
  const value = Number(trimmed);
  if (Number.isNaN(value)) {
    return { valid: false, error: "Please enter a number, not text." };
  }
  if (value < 0 || value > 10) {
    return { valid: false, error: "Please enter a number between 0 and 10." };
  }
  // must be a multiple of 0.5
  const doubled = value * 2;
  if (Math.abs(doubled - Math.round(doubled)) > 1e-9) {
    return {
      valid: false,
      error: "Only whole or half numbers are allowed (e.g. 4 or 4.5).",
    };
  }
  return { valid: true, error: null };
}

// Numeric questions (sleep, meals, exercise): any non-negative number/float.
function validateNumeric(rawText) {
  const trimmed = rawText.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: null };
  }
  const value = Number(trimmed);
  if (Number.isNaN(value)) {
    return { valid: false, error: "Please enter a valid number." };
  }
  if (value < 0) {
    return { valid: false, error: "Please enter a number of 0 or higher." };
  }
  return { valid: true, error: null };
}

// Text question (reflection): just can't be empty.
function validateText(rawText) {
  const trimmed = rawText.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: null };
  }
  return { valid: true, error: null };
}

function validateAnswer(type, rawText) {
  if (type === "scale") return validateScale(rawText);
  if (type === "numeric") return validateNumeric(rawText);
  return validateText(rawText);
}

function AssessmentScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [reflectionPrompt, setReflectionPrompt] = useState(null);

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  // Tracks whether the user has actually tried typing in the current
  // question yet, so we don't show an error before they've typed anything.
  const [touched, setTouched] = useState({});

  const authCtx = useContext(AuthContext);

  const currentQuestion = CARELOG_QUESTIONS[currentQuestionIdx];
  const currentAnswer = answers[currentQuestionIdx] || "";

  const { valid: isCurrentValid, error: currentError } = useMemo(
    () => validateAnswer(currentQuestion.type, currentAnswer),
    [currentQuestion.type, currentAnswer],
  );

  const canMoveForward = isCurrentValid;
  const showError =
    touched[currentQuestionIdx] && !isCurrentValid && currentError;

  const isLast = currentQuestionIdx === CARELOG_QUESTIONS.length - 1;
  const firstQuestion = currentQuestionIdx === 0;

  // The big number-entry font needs to fit the screen width — cap it
  // relative to `width` (same idea as buttonWidth in LandingScreen)
  // instead of a fixed 80px, so it never overflows on narrow phones.
  const answerFontSize = isLast ? 22 : Math.min(width * 0.18, 72);
  // Placeholder stays a fixed, readable size regardless of the answer
  // font, so a full sentence placeholder never gets cut off.
  const placeholderFontSize = isLast ? 16 : 17;
  const inputMinHeight = Math.min(height * 0.2, 150);

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

  function handleChangeText(text) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: text,
    }));
    setTouched((prev) => ({ ...prev, [currentQuestionIdx]: true }));
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
      if (data?.reflection_prompt) {
        setReflectionPrompt(data.reflection_prompt);
      }
    } catch (error) {
      console.log("CARELOG ERROR:", error);
      setErrorModalVisible(true);
    }
  }

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
            contentContainerStyle={{
              paddingVertical: 40,
              alignItems: "center",
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"handled"}
          >
            <Text style={[styles.questions, styles.globalFont]}>
              {currentQuestion.question}
            </Text>

            {/* Wrapper lets us render a custom placeholder behind the
                TextInput, sized independently from the big answer font,
                so long placeholder text never gets clipped. */}
            <View style={[styles.inputWrapper, { minHeight: inputMinHeight }]}>
              {currentAnswer.length === 0 && (
                <Text
                  style={[
                    styles.customPlaceholder,
                    styles.globalFont,
                    { fontSize: placeholderFontSize },
                    isLast && styles.customPlaceholderMultiline,
                  ]}
                  numberOfLines={isLast ? undefined : 1}
                  ellipsizeMode="tail"
                  pointerEvents="none"
                >
                  {currentQuestion.placeholder}
                </Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  styles.globalFont,
                  { fontSize: answerFontSize, minHeight: inputMinHeight },
                  isLast && {
                    textAlignVertical: "top",
                    textAlign: "left",
                  },
                  showError && styles.inputError,
                ]}
                keyboardType={isLast ? "default" : "decimal-pad"}
                multiline={isLast}
                caretHidden={false}
                cursorColor={Colors.darkNeutral}
                selectionColor="#cac9c9"
                // Native placeholder left blank on purpose — using the
                // custom overlay above instead so we control its size.
                placeholder=""
                placeholderTextColor="#cac9c9"
                value={currentAnswer}
                onChangeText={handleChangeText}
              />
            </View>

            {showError && (
              <Text style={[styles.errorText, styles.globalFont]}>
                {currentError}
              </Text>
            )}
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
              style={[styles.btn, !canMoveForward && { opacity: 0.5 }]}
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
          <View
            style={[styles.modalView, { width: Math.min(width * 0.8, 340) }]}
          >
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
          <View
            style={[styles.modalView, { width: Math.min(width * 0.8, 340) }]}
          >
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

      {/* Gentle reflection nudge */}
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
    width: "100%",
    alignItems: "center",
  },
  mainContainer: {
    width: "100%",
    maxWidth: 760,
    flex: 1,
    backgroundColor: Colors.bgColor,
    paddingHorizontal: "5%",
    paddingBottom: "15%",
    paddingTop: "5%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    width: "100%",
    justifyContent: "center",
  },
  input: {
    textAlign: "center",
    color: Colors.darkNeutral,
    width: "100%",
  },
  inputError: {
    borderBottomWidth: 2,
    borderBottomColor: "#D9534F",
  },
  customPlaceholder: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#B0B0B0",
    alignSelf: "center",
  },
  customPlaceholderMultiline: {
    textAlign: "left",
    top: 4,
  },
  errorText: {
    color: "#D9534F",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 10,
  },
  footer: {
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {},
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
