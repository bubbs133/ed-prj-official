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

  console.log("Current state -> Username:", username, "| Password:", password);

  async function loginHandler() {
    console.log("pressed log in btn");
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
    justifyContent: "center", // Changed from flex-start + top: 35% to pure center
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputElements: {
    width: 300,
    marginBottom: 27,
  },
  loginBtn: {
    borderRadius: 10,
    height: 40,
    width: 150,
    borderColor: Colors.landingBlue,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Ensure it has a background so it's clickable!
  },
  loginBtnView: {
    marginTop: 15,
  },
  loginBtnTitle: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.landingBlue,
    fontFamily: "Afacad",
    fontWeight: "500",
    letterSpacing: 2,
  },
});

export default LoginScreen;
