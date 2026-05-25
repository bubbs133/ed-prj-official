import {
  StyleSheet,
  Text,
  View,
  Button,
  ImageBackground,
  Pressable,
} from "react-native";
import { useContext, useState } from "react";
import Input from "../components/Input";
import { createUser } from "../auth/auth";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../auth/auth-context";
import Colors from "../constants/colors";

function SignUpScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  //const auth = getAuth();
  //const user = auth.currentUser;

  const authCtx = useContext(AuthContext);

  async function signupHandler() {
    try {
      const url = "http://127.0.0.1:8000/users/";
      //const url = "http://192.168.0.125:8000/users/";
      let result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });
      result = await result.json();
      if (result) {
        console.log("User added", result);
        setEmail("");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("User not added", "Please try again");
    }
  }

  /*async function signupHandler() {
    try {
      const data = await createUser(email, password);
      //await AsyncStorage.setItem("username", username);
      //navigation.replace("Home");
      authCtx.authenticate(data.idToken);
      console.log("Successful", data);
      onLogin();
    } catch (error) {
      //console.error("Sign up failed");
      console.log("Signup error:", error.response?.data || error.message);
    }
  }*/
  return (
    <ImageBackground
      source={require("../assets/main/signupbg.png")}
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
            }}
          />
        </View>

        <View style={styles.signinBtnView}>
          <Pressable style={styles.signupBtn} onPress={signupHandler}>
            <Text style={styles.signinBtnTitle}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

export default SignUpScreen;

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
  signupBtn: {
    //borderRadius: 50,
    height: 37,
    width: 300,
    //backgroundColor: Colors.lightNeutral,
    marginBottom: 10,
    marginTop: 10,
    //borderColor: Colors.darkNeutral,
    //borderWidth: 2,
    //borderBottomWidth: 4,
  },
  signinBtnView: {
    position: "absolute",
    bottom: "22%"
  },
  signinBtnTitle: {
    textAlign: "center",
    fontSize: 19,
    color: Colors.darkNeutral,
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: 500,
    letterSpacing: 2,
  },
});
