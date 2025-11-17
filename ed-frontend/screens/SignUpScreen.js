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
  //const [username, setUsername] = useState("");

  //const auth = getAuth();
  //const user = auth.currentUser;

  const authCtx = useContext(AuthContext);

  async function signupHandler() {
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
  }
  return (
    <ImageBackground
      source={require("../assets/signin.png")}
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

        <View style={styles.signinBtnView}>
          <Pressable style={styles.loginBtn} onPress={signupHandler}>
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
  loginBtn: {
    borderRadius: 50,
    height: 37,
    width: 300,
    backgroundColor: Colors.lightNeutral,
    marginBottom: 10,
    marginTop: 10,
    borderColor: Colors.darkNeutral,
    borderWidth: 2,
    //borderBottomWidth: 4,
  },
  signinBtnView: {
    position: "absolute",
    bottom: 100,
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
