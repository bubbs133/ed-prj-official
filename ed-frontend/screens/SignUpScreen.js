import { StyleSheet, Text, View, Button } from "react-native";
import { useState } from "react";
import Input from "../components/Input";
import { createUser, loginUser } from "../auth/auth";

function SignUpScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  async function signupHandler() {
    try {
      const data = await createUser(email, password);
      //navigation.replace("Home");
      console.log("Successful", data)
      onLogin();
    } catch (error) {
      //console.error("Sign up failed");
      console.log("Signup error:", error.response?.data || error.message);
    }
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.signupContainer}>
        <View style={styles.inputElements}>
          <Text>signup page</Text>
          <Input
            lable="email"
            textInputConfig={{
              value: email,
              onChangeText: setEmail,
              autoCorrect: false,
              autoComplete: false,
            }}
          />
        </View>
        <View style={styles.inputElements}>
          <Input
            lable="password"
            textInputConfig={{
              value: password,
              onChangeText: setPassword,
              autoCorrect: false,
              autoComplete: false,
            }}
          />
        </View>
      </View>
      <View>
        <Button title="Signup" color="#000" onPress={signupHandler} />
      </View>
    </View>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
