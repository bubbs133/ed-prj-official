import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { assessment } from "../models/assessment";
import SecondButton from "../components/SecondButton";
import Colors from "../constants/colors";

function AssessmentScreen() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(1);
  //const [question, setQuestion] = useState("");

  function nextQuestionHandler() {
    if (currentQuestionIdx < assessment.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  }

  function prevQuestionHandler() {
    if (currentQuestionIdx <= assessment.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  }

  function optionsHandler() {
    console.log("pressed");
  }

  const currentQuestion = assessment[currentQuestionIdx];
  const currentQuestionOptions = currentQuestion.options;

  const lastQuestion = currentQuestionIdx === assessment.length + 1;
  const firstQuestion = currentQuestionIdx === 1;

  return (
    <ImageBackground
      source={require("../assets/profilebg.png")}
      style={styles.backgroundImg}
    >
      <View style={styles.container}>
        <Text style={[styles.centering, styles.globalFont]}>
          {currentQuestionIdx} / 12
        </Text>
        <Text style={[styles.centering, styles.globalFont]}>{currentQuestion.question}</Text>
        {currentQuestionOptions.map((itemLable, idx) => (
          <Pressable style={styles.centering} key={idx} onPress={optionsHandler}>
            <Text style={styles.globalFont} key={idx}>
              {itemLable.lable}
            </Text>
          </Pressable>
        ))}
        <View style={styles.btns}>
          <Pressable onPress={prevQuestionHandler} disabled={firstQuestion}>
            <Text style={styles.globalFont}>Back</Text>
          </Pressable>
          <Pressable onPress={nextQuestionHandler} disabled={lastQuestion}>
            <Text style={styles.globalFont}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#fff",
    //alignItems: "center",
    justifyContent: "center",
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
  centering: {
    alignItems: "center",
    justifyContent: "center",
  },
  btns: {
    //bottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AssessmentScreen;
