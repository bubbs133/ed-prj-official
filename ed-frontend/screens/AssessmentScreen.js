import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  ImageBackground,
  Modal,
  TextInput,
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

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(1);
  const [answers, setAnswers] = useState({});

  const authCtx = useContext(AuthContext);

  function nextQuestionHandler() {
    if (currentQuestionIdx < CARELOG_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  }

  function prevQuestionHandler() {
    if (currentQuestionIdx <= CARELOG_QUESTIONS.length - 1) {
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
          energy_level: Number(answers[4]),
          sleep_hours: Number(answers[5]),
          num_meals: Number(answers[6]),
          exercise_minutes: Number(answers[7]),
          notes: answers[8],
        }),
      });

      const data = await result.json();
      console.log(data);
      setModalVisible(!modalVisible);
    } catch (error) {
      console.log(error);
      Alert.alert("Care log not added", "Please try again");
    }
  }

  const currentQuestion = CARELOG_QUESTIONS[currentQuestionIdx];
  //const currentQuestionOptions = currentQuestion.options;

  const lastQuestion = currentQuestionIdx === CARELOG_QUESTIONS.length + 1;
  const firstQuestion = currentQuestionIdx === 1;
  const isLast = currentQuestionIdx === 8;

  return (
    <SafeAreaView style={[styles.container]} edges={["top", "left", "right"]}>
      <View style={[styles.mainContainer]}>
        <View style={styles.top}>
          <GoBack navigation={navigation} />
        </View>
        <View>
          <Text style={[styles.numQuestions, styles.globalFont]}>
            {currentQuestionIdx} / 8
          </Text>
        </View>
        <Text style={[styles.questions, styles.globalFont]}>
          {currentQuestion.question}
        </Text>
        <TextInput
          style={[styles.input, styles.globalFont]}
          keyboardType="decimal-pad"
          value={answers[currentQuestionIdx] || ""}
          onChangeText={(text) => {
            setAnswers((prev) => ({
              ...prev,
              [currentQuestionIdx]: text,
            }));
          }}
        />
        <View style={styles.btns}>
          <Pressable
            style={styles.btn}
            onPress={isLast ? submitHandler : nextQuestionHandler}
            disabled={lastQuestion}
          >
            <Text style={[styles.btnTitle, styles.globalFont]}>
              {isLast ? "Submit" : "Next"}
            </Text>
          </Pressable>
          <Pressable
            style={styles.btn}
            onPress={prevQuestionHandler}
            disabled={firstQuestion}
          >
            <Text style={[styles.btnTitle, styles.globalFont]}>Back</Text>
          </Pressable>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
            navigation.navigate("Sandbox");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: Colors.seaBlue2,
    flex: 1,
  },
  mainContainer: {
    marginLeft: "5%",
    marginRight: "5%",
  },
  backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },
  globalFont: {
    fontFamily: "Afacad",
    color: Colors.darkNeutral,
  },
  numQuestions: {
    fontSize: 17,
    //fontWeight: 500,
    textAlign: "center",
  },
  input: {
    height: "40%",
    //borderWidth: 1,
    //borderColor: "black",
    marginTop: "15%",
    textAlign: "center",
    fontSize: 150,
  },
  questions: {
    fontSize: 22,
    letterSpacing: 1,
    textAlign: "center",
    //fontWeight: 500,
    marginTop: "10%",
  },
  btns: {
    alignItems: "center",
  },
  btn: {
    borderRadius: 50,
    height: 37,
    width: 300,
    backgroundColor: "transparent",
    marginBottom: 10,
    marginTop: 10,
    borderColor: Colors.darkNeutral,
    borderWidth: 2,
  },
  btnTitle: {
    textAlign: "center",
    fontSize: 19,
    color: Colors.darkNeutral,
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: 700,
    letterSpacing: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "red",
    alignItems: "center",
    width: "100%",
    height: "100%",
    //borderRadius: 30,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 150,
    textAlign: "center",
  },
});

export default AssessmentScreen;
