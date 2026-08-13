import { API_BASE_URL } from "@env";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Button,
  Alert,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useContext, useState } from "react";
import Input from "../components/Input";
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
      const url = `${API_BASE_URL}/login/`;
      //const url = `${API_BASE_URL}/login/`;
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
        await authCtx.authenticate(data.token, {
          username: data.username,
          email: data.email,
        });
        setUsername("");
        setPassword("");
        navigation.navigate("TabNav");

        console.log("LOGIN RESPONSE:", data);
      } else {
        Alert.alert("Login failed", data.detail || "Invalid credentials");
      }
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert(
        "Invalid information!",
        "Please enter the correct information.",
      );
    }
  }

  return (
    <ImageBackground
      source={require("../assets/main/loginbg2.png")}
      style={styles.backgroundImg}
    >
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
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
                secureTextEntry: true,
              }}
            />
          </View>
        </View>
        <View style={styles.loginBtnView}>
          <TouchableOpacity style={styles.loginBtn} onPress={loginHandler}>
            <Text style={styles.loginBtnTitle}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    top: "35%",
  },
  inputContainer: {},
  inputElements: {
    width: 300,
    marginBottom: 27,
  },
  loginBtn: {
    borderRadius: 10,
    height: 35,
    width: 150,
    borderColor: Colors.landingBlue,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 2.5,
    position: height * 0.2,
    //borderBottomWidth: 4,
  },
  loginBtnView: {
    paddingTop: 15,
  },
  loginBtnTitle: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.landingBlue,
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: 500,
    letterSpacing: 2,
  },
});

export default LoginScreen;
