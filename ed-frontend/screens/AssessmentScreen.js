import { StyleSheet, Text, View, Button, Pressable } from "react-native";
import { useState } from "react";
import { assessment } from "../models/assessment";

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
    <View style={styles.container}>
      <Text>AssessmentScreen</Text>
      <Text>{currentQuestionIdx} / 12</Text>
      <Text>{currentQuestion.question}</Text>
      {currentQuestionOptions.map((itemLable, idx) => (
        <Pressable key={idx} onPress={optionsHandler}>
          <Text key={idx}>{itemLable.lable}</Text>
        </Pressable>
      ))}
      <Button title="Next" color="#000" onPress={nextQuestionHandler} disabled={lastQuestion}></Button>
      <Button title="Back" color="#000" onPress={prevQuestionHandler} disabled={firstQuestion}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AssessmentScreen;
