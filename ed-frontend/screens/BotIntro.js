import { Button, StyleSheet, Text, View, Pressable } from "react-native";

function BotIntro({ navigation }) {
  function continueHandler() {
    navigation.navigate("Chatbot");
  }
  return (
    <View style={styles.container}>
      <Text>Sage the Chatbot</Text>
      <Text>
        Sage is intended a provide general guidance on eating disorders such as
        what they are, symptoms, and potential steps one can take as a start to
        their recovery journey.
      </Text>
      <Text>
        This chatbot is not a replacement to professional medical advice or
        care. If you think you are in a life threatening situation immediately
        contact your local emergency room.
      </Text>
      <Text>Suicide & Crisis Lifeline</Text>
      <Text>
        Professional help is always at your reach, if you are experiencing a
        crisis contact the Suicide and Crisis Lifeline.
      </Text>
      <Text>For residents in the US & Canada call or text 988.</Text>
      <Button title="Call 988" color="#000"></Button>
      <Button title="Text 988" color="#000"></Button>
      <Text>
        For international residents visit Lifeline International and contact
        your country's local lifeline.
      </Text>
      <Button title="International Lifeline" color="#000"></Button>
      <Pressable style={styles.loginBtn} onPress={continueHandler}>
        <Text style={styles.loginBtnTitle}>Continue</Text>
      </Pressable>
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

export default BotIntro;
