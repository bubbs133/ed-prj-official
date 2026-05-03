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
import { useContext, useState, useEffect } from "react";
import Input from "../components/Input";
import { loginUser } from "../auth/auth";
import { StackActions } from "@react-navigation/native";
import { AuthContext } from "../auth/auth-context";
import Colors from "../constants/colors";

function LoginScreen({ navigation }) {
  //const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authCtx = useContext(AuthContext);

  async function loginHandler() {
    try {
      const url = "http://127.0.0.1:8000/login/";
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      
      if (response.ok && data.token) {
        console.log("Login successful, token:", data.token);
        await authCtx.authenticate(data.token);
        setUsername("");
        setPassword("");
        navigation.navigate("TabNav");
      } else {
        Alert.alert("Login failed", data.detail || "Invalid credentials");
      }
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Invalid info!", "Please enter the correct information.");
    }
  }

  useEffect(() => {
    console.log("AUTH TOKEN UPDATED:", authCtx.token);
  }, [authCtx.token]);

  return (
    <ImageBackground
      source={require("../assets/main/umilogin.png")}
      style={styles.backgroundImg}
    >
      <View style={styles.mainContainer}>
        <View style={styles.inputElements}>
          <Input
            lable="username"
            textInputConfig={{
              value: username,
              onChangeText: setUsername,
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
              secureTextEntry: true,
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
    height: 37,
    width: 300,
    borderColor: Colors.floaterCream,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 3,
    //borderBottomWidth: 4,
  },
  loginBtnView: {
    position: "absolute",
    bottom: 50,
  },
  loginBtnTitle: {
    textAlign: "center",
    fontSize: 19,
    color: Colors.floaterCream,
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: 500,
    letterSpacing: 2,
  },
});

export default LoginScreen;
