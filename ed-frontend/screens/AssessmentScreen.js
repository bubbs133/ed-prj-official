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
import GoBack from "../components/GoBack";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

function AssessmentScreen({ navigation }) {
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
      <SafeAreaView style={[styles.container]}>
        <View>
          <View style={styles.top}>
            <GoBack navigation={navigation} />
          </View>
          <View>
            <Text style={[styles.centering, styles.globalFont]}>
              {currentQuestionIdx} / 12
            </Text>
          </View>
          <Text style={[styles.centering, styles.globalFont]}>
            {currentQuestion.question}
          </Text>
          {currentQuestionOptions.map((itemLable, idx) => (
            <Pressable
              style={[styles.centering, styles.optionBtns]}
              key={idx}
              onPress={optionsHandler}
            >
              <Text style={[styles.centering, styles.globalFont]} key={idx}>
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
      </SafeAreaView>
    </ImageBackground>
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
  centering: {
    alignItems: "center",
    justifyContent: "center",
  },
  btns: {
    //bottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionBtns: {
    borderColor: Colors.darkNeutral,
    borderWidth: 2,
    width: 100,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 5,
  },
});

export default AssessmentScreen;
