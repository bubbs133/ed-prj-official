import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  ImageBackground,
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
    } catch (error) {
      console.log(error);
    }
  }

  const currentQuestion = CARELOG_QUESTIONS[currentQuestionIdx];
  //const currentQuestionOptions = currentQuestion.options;

  const lastQuestion = currentQuestionIdx === CARELOG_QUESTIONS.length + 1;
  const firstQuestion = currentQuestionIdx === 1;
  const isLast = currentQuestionIdx === 8;

  return (
    <SafeAreaView style={[styles.container]} edges={["top", "left", "right"]}>
      <View>
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
          style={styles.input}
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
          <Pressable onPress={prevQuestionHandler} disabled={firstQuestion}>
            <Text style={[styles.btn, styles.globalFont]}>Back</Text>
          </Pressable>
          <Pressable
            onPress={isLast ? submitHandler : nextQuestionHandler}
            disabled={lastQuestion}
          >
            <Text style={[styles.btn, styles.globalFont]}>
              {isLast ? "Submit" : "Next"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#fff",
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
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
  },
  questions: {
    fontSize: 25,
    letterSpacing: 1,
    textAlign: "center",
    fontWeight: 500,
    marginTop: "30%"
  },
  btns: {
    //bottom: 10,
    fontSize: 17,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    fontSize: 17,
    letterSpacing: 0.5,
  },
});

export default AssessmentScreen;
