import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import Colors from "../constants/colors";

function LandingScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  function loginButtonHandler() {
    navigation.navigate("Login");
  }

  function signupButtonHandler() {
    navigation.navigate("SignUp");
  }

  const buttonWidth = Math.min(width * 0.85, 300);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/main/landing2.png")}
        style={[styles.backgroundImg, { width, height }]}
        resizeMode="cover"
      >
        <View style={styles.mainContainer}>
          <View style={styles.btns}>
            <TouchableOpacity
              style={[styles.loginbtn, { width: buttonWidth }]}
              onPress={loginButtonHandler}
            >
              <Text style={styles.btnTitles}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signupbtn, { width: buttonWidth }]}
              onPress={signupButtonHandler}
            >
              <Text style={styles.btnTitles}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },

  backgroundImg: {
    flex: 1,
    width: "100%",
  },

  mainContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },

  btns: {
    position: "absolute",
    bottom: 35,
    width: "100%",
    alignItems: "center",
  },

  loginbtn: {
    height: 45,
    borderRadius: 10,
    backgroundColor: Colors.landingBlue,
    marginVertical: 5,
    borderColor: Colors.landingBlue,
    borderWidth: 2.5,
    justifyContent: "center",
  },

  signupbtn: {
    height: 45,
    borderRadius: 10,
    backgroundColor: "transparent",
    marginVertical: 5,
    borderColor: Colors.landingBlue,
    borderWidth: 2.5,
    justifyContent: "center",
  },

  btnTitles: {
    textAlign: "center",
    fontSize: 19,
    color: Colors.floaterCream,
    fontFamily: "Afacad",
    fontWeight: "700",
    letterSpacing: 2,
  },
});

export default LandingScreen;