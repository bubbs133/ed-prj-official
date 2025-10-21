import { View, TextInput, Text, StyleSheet, Button, Alert } from "react-native";
import { useState } from "react";
import Input from "../components/Input";
import { loginUser } from "../auth/auth";
import { StackActions } from "@react-navigation/native";

function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  function signupScreenHandler() {
    console.log("signup");
    navigation.navigate("SignUp");
  }

  async function loginHandler() {
    console.log("logged in!");
    try {
      await loginUser(email, password);
      console.log("Successful log")
      onLogin();
    } catch (error) {
      Alert.alert("Invalid info!", "Please enter the correct information.")
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.loginContainer}>
        <View style={styles.inputElements}>
          <Text>login page</Text>
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
        <Button title="Login" color="#000" onPress={loginHandler} />
      </View>
      {/*<Text>
        Dont have an account?
        <Button
          title="Sign up here."
          color="#000"
          onPress={signupScreenHandler}
        />
      </Text>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  loginContainer: {
    alignSelf: "center",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputElements: {
    width: "77%",
    marginBottom: 27,
  },
});

export default LoginScreen;
