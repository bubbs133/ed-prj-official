import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import React from "react";

function LandingScreen({ navigation }) {
  function loginButtonHandler() {
    navigation.navigate("Login");
    console.log("login btn");
  }

  function signupButtonHandler() {
    navigation.navigate("SignUp");
    console.log("sigup btn");
  }

  return (
    <ImageBackground
      source={require("../assets/landing-bg.png")}
      style={styles.backgroundImg}
    >
      <View style={styles.container}>
        <View style={styles.btns}>
          <View>
            <Pressable style={styles.btn} onPress={loginButtonHandler}>
              <Text style={styles.btnTitles}>Login</Text>
            </Pressable>
          </View>
          <View>
            <Pressable style={styles.btn} onPress={signupButtonHandler}>
              <Text style={styles.btnTitles}>Sigup</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },
  btns: {
    position: "absolute",
    bottom: 35,
  },
  btn: {
    borderRadius: 50,
    height: 30,
    width: 300,
    backgroundColor: "#DBE6F1",
    marginBottom: 10,
    marginTop: 10
  },
  btnTitles: {
    textAlign: "center",
    fontSize: 19,
    color: "#607FA8",
    marginTop: 5,
  },
});

export default LandingScreen;
