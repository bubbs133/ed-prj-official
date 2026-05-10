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
  KeyboardAvoidingView,
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
      const result = await fetch("http://127.0.0.1:8000/care-log-cluster/", {
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
      console.log(data);
      setModalVisible(!modalVisible);
    } catch (error) {
      console.log(error);
      setErrorModalVisible(!errorModalVisible);
      //Alert.alert("Care log not added", "Please try again");
    }
  }

  const currentQuestion = CARELOG_QUESTIONS[currentQuestionIdx];
  //const currentQuestionOptions = currentQuestion.options;

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
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
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
              caretHidden={true}
              //placeholder={isLast ? "Type your thoughts here..." : null}
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
            <Pressable
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
            </Pressable>

            {!firstQuestion && (
              <Pressable style={styles.btn} onPress={prevQuestionHandler}>
                <Text style={[styles.btnTitle, styles.globalFont]}>Back</Text>
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Text style={{ fontSize: 50 }}>✨</Text>
            </View>
            <Text style={[styles.modalTitle, styles.globalFont]}>Awesome!</Text>
            <Text style={[styles.modalText, styles.globalFont]}>
              Your assessment has been successfully submitted.
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Text style={{ fontSize: 50 }}>❌</Text>
            </View>
            <Text style={[styles.modalTitle, styles.globalFont]}>Uh oh!</Text>
            <Text style={[styles.modalText, styles.globalFont]}>
              Care log not submitted, please try again.
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
  mainContainer: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  top: {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    //paddingVertical: 10,
  },
  input: {
    //marginTop: "50%",
    textAlign: "center",
    fontSize: 150, // Huge for numbers
    color: Colors.darkNeutral,
  },
  footer: {
    paddingBottom: 20,
    alignItems: "center",
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
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
  numQuestions: {
    fontSize: 18,
    //fontWeight: 'bold',
    textAlign: "center",
  },
  questions: {
    fontSize: 24,
    textAlign: "center",
    marginTop: -170,
  },
  btn: {
    //backgroundColor: Colors.darkNeutral,
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 12,
    marginVertical: 10,
  },
  btnTitle: {
    color: "white",
    fontSize: 18,
  },
  modalIconContainer: {
    marginBottom: 20,
  },
});

export default AssessmentScreen;
