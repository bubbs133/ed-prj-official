import { API_BASE_URL } from "@env";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Alert,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import Checkbox from "expo-checkbox";
import GoBack from "../components/GoBack";
import { useContext, useState } from "react";
import Input from "../components/Input";
import { AuthContext } from "../auth/auth-context";
import Colors from "../constants/colors";

function SignUpScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { width, height } = useWindowDimensions();

  const authCtx = useContext(AuthContext);

  async function signupHandler() {
    if (!termsAccepted) {
      Alert.alert("Terms of Use", "Please agree to the Terms of Use to continue.");
      return;
    }

    try {
      const url = `${API_BASE_URL}/users/`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
          terms_accepted: termsAccepted,
        }),
      });
      const data = await response.json();
      if (response.ok && data.verification_required) {
        setNeedsVerification(true);
        Alert.alert("Verify your email", "We sent a verification code to your email.");
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
      setEmail("");
      setUsername("");
      setPassword("");
      navigation.navigate("TabNav");
    } catch (error) {
      Alert.alert("Verification failed", error.message);
    }
  }

  return (
    <ImageBackground
      source={require("../assets/main/signupbg.png")}
      style={[styles.backgroundImg, { width, height }]}
      resizeMode="cover"
    >
      <View style={styles.mainContainer}>
        {!needsVerification ? (
          <>
            <View style={styles.inputElements}>
              <Input
                label="email"
                textInputConfig={{
                  value: email,
                  onChangeText: setEmail,
                  autoCorrect: false,
                  keyboardType: "email-address",
                  autoCapitalize: "none",
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
          </>
        ) : (
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
        {!needsVerification && (
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setTermsAccepted((accepted) => !accepted)}
          >
            <Checkbox value={termsAccepted} onValueChange={setTermsAccepted} />
            <Text style={styles.termsText}>I agree to the Terms of Use</Text>
          </TouchableOpacity>
        )}

        <View style={styles.signinBtnView}>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={needsVerification ? verifyHandler : signupHandler}
          >
            <Text style={styles.signinBtnTitle}>
              {needsVerification ? "Verify Email" : "Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

export default SignUpScreen;

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
    backgroundColor: "#fff",
  },
  signinBtnView: {
    paddingTop: 15,
  },
  termsRow: {
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  termsText: {
    color: Colors.landingBlue,
    fontFamily: "Afacad",
    fontSize: 15,
  },
  signinBtnTitle: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.landingBlue,
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: "500",
    letterSpacing: 2,
  },
});
