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
    //console.log("login btn");
  }

  function signupButtonHandler() {
    navigation.navigate("SignUp");
    console.log("sigup btn");
  }

  return (
    <ImageBackground
      source={require("../assets/main/newumilanding.png")}
      style={styles.backgroundImg}
    >
      <View style={styles.container}>
        <View style={styles.btns}>
          <View>
            <Pressable style={styles.loginbtn} onPressIn={loginButtonHandler}>
              <Text style={styles.btnTitles}>Login</Text>
            </Pressable>
          </View>
          <View>
            <Pressable style={styles.signupbtn} onPress={signupButtonHandler}>
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
  loginbtn: {
    borderRadius: 50,
    height: 37,
    width: 300,
    backgroundColor: "transparent",
    marginBottom: 10,
    marginTop: 10,
    borderColor: "#C0D0E1",
    //borderColor: "#42190D",
    //borderColor: "#9B8E75",
    borderWidth: 2,
    //borderBottomWidth: 4,
    //borderRightWidth: 4
  },
  signupbtn: {
    borderRadius: 50,
    height: 37,
    width: 300,
    backgroundColor: "transparent",
    marginBottom: 10,
    marginTop: 10,
    //borderColor: "#ADBCBE",
    //borderColor: "#42190D",
    borderColor: "#C0D0E1",
    borderWidth: 2,
    //borderBottomWidth: 4,
    //borderRightWidth: 4
  },
  btnTitles: {
    textAlign: "center",
    fontSize: 19,
    //color: "#42190D",
    color: "#C0D0E1",
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: 500,
    letterSpacing: 2,
  },
});

export default LandingScreen;
