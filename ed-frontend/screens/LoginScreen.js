import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Button,
  Alert,
  Pressable,
  ImageBackground,
} from "react-native";
import { useContext, useState } from "react";
import Input from "../components/Input";
import { loginUser } from "../auth/auth";
import { StackActions } from "@react-navigation/native";
import { AuthContext } from "../auth/auth-context";

function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [username, setUsername] = useState("");

  const authCtx = useContext(AuthContext);

  async function loginHandler() {
    console.log("logged in!");
    try {
      const data = await loginUser(email, password);
      authCtx.authenticate(data.idToken);
      console.log("Successful log");
      onLogin();
    } catch (error) {
      Alert.alert("Invalid info!", "Please enter the correct information.");
    }
  }

  return (
    <ImageBackground
      source={require("../assets/login-bg2.png")}
      style={styles.backgroundImg}
    >
      <View style={styles.mainContainer}>
        <View style={styles.inputElements}>
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
        <View style={styles.loginBtnView}>
          <Pressable style={styles.loginBtn} onPress={loginHandler}>
            <Text style={styles.loginBtnTitle}>Login</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputElements: {
    width: 300,
    marginBottom: 27,
  },
  loginBtn: {
    borderRadius: 50,
    height: 30,
    width: 300,
    backgroundColor: "#DBE6F1",
    marginBottom: 10,
    marginTop: 10,
  },
  loginBtnView: {
    position: "absolute",
    bottom: 100
  },
  loginBtnTitle: {
    textAlign: "center",
    fontSize: 19,
    color: "#607FA8",
    marginTop: 5,
  },
});

export default LoginScreen;
