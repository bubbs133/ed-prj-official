import { Button, StyleSheet, Text, View } from "react-native";

function AssessmentIntroScreen({ navigation }) {

  function continueHandler() {
    navigation.navigate("Assessment");
  }

  function skipHandler() {
    navigation.navigate("Home");
  }

  return (
    <View style={styles.container}>
      <Text>Let's get started with a simple assessment.</Text>
      <Text>
        The assessment will be used to evaluate where you stand and help us
        build a more personalized dashboard for you.
      </Text>
      <Button title="Continue" color="#000" onPress={continueHandler}></Button>
      <Button title="Skip" color="#000" onPress={skipHandler}></Button>
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

export default AssessmentIntroScreen;
