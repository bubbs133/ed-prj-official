import { API_BASE_URL } from "@env";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ImageBackground,
  Pressable,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useContext, useState } from "react";
import Input from "../components/Input";
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
      const url = `${API_BASE_URL}/users/`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        await authCtx.authenticate(data.token, { username, email });
        setEmail("");
        setUsername("");
        setPassword("");
        navigation.navigate("TabNav");
      } else {
        Alert.alert(
          "Sign up failed",
          data.detail ||
            data.username?.[0] ||
            data.email?.[0] ||
            data.password?.[0] ||
            "Please try again",
        );
      }
    } catch (error) {
      console.log("Signup error:", error);
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
            label="email"
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
            label="username"
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
            label="password"
            textInputConfig={{
              value: password,
              onChangeText: setPassword,
              autoCorrect: false,
              autoComplete: false,
              secureTextEntry: true
            }}
          />
        </View>

        <View style={styles.signinBtnView}>
          <TouchableOpacity style={styles.signupBtn} onPress={signupHandler}>
            <Text style={styles.signinBtnTitle}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

export default SignUpScreen;

const { height } = Dimensions.get("window");

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
    borderRadius: 10,
    height: 35,
    width: 150,
    borderColor: Colors.landingBlue,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 2.5,
    position: height * 0.2,
  },
  signinBtnView: {
     paddingTop: 15
  },
  signinBtnTitle: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.landingBlue,
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: 500,
    letterSpacing: 2,
  },
});
