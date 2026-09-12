import { API_BASE_URL } from "@env";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useContext, useState } from "react";
import Input from "../components/Input";
import { AuthContext } from "../auth/auth-context";
import Colors from "../constants/colors";

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const { width, height } = useWindowDimensions();

  const authCtx = useContext(AuthContext);

  async function loginHandler() {
    try {
      const url = `${API_BASE_URL}/login/`;
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
      } else if (data.verification_required) {
        setNeedsVerification(true);
        Alert.alert("Verify your email", "We sent a new verification code to your email.");
      } else {
        Alert.alert(
          "Login failed",
          data.detail || data.non_field_errors?.[0] || "Invalid credentials",
        );
      }
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert(
        "Invalid information!",
        "Please enter the correct information.",
      );
    }
  }

  async function verifyHandler() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, code: verificationCode }),
      });
      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.detail || "Invalid verification code.");
      }

      await authCtx.authenticate(data.token, {
        username: data.username,
        email: data.email,
      });
      navigation.navigate("TabNav");
    } catch (error) {
      Alert.alert("Verification failed", error.message);
    }
  }

  return (
    <ImageBackground
      source={require("../assets/main/loginbg2.png")}
      style={[styles.backgroundImg, { width, height }]}
      resizeMode="cover"
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
          {needsVerification && (
            <View style={styles.inputElements}>
              <Input
                label="verification code"
                textInputConfig={{
                  value: verificationCode,
                  onChangeText: setVerificationCode,
                  keyboardType: "number-pad",
                  maxLength: 6,
                }}
              />
            </View>
          )}
        </View>
        <View style={styles.loginBtnView}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={needsVerification ? verifyHandler : loginHandler}
          >
            <Text style={styles.loginBtnTitle}>
              {needsVerification ? "Verify Email" : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#fff",
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
