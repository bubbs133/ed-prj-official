import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "../constants/colors";

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
      source={require("../assets/main/landing2.png")}
      style={styles.backgroundImg}
    >
      <View style={styles.container}>
        <View style={styles.btns}>
          <View>
            <TouchableOpacity style={styles.loginbtn} onPressIn={loginButtonHandler}>
              <Text style={styles.btnTitles}>Login</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.signupbtn} onPress={signupButtonHandler}>
              <Text style={styles.btnTitles}>Signup</Text>
            </TouchableOpacity>
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
    borderRadius: 10,
    height: 37,
    width: 300,
    backgroundColor: Colors.landingBlue,
    marginBottom: 10,
    marginTop: 10,
    //borderColor: Colors.floaterCream,
    borderColor: Colors.landingBlue,
    //borderColor: "#42190D",
    //borderColor: "#9B8E75",
    borderWidth: 2.5,
    //borderBottomWidth: 4,
    //borderRightWidth: 4
  },
  signupbtn: {
    borderRadius: 10,
    height: 37,
    width: 300,
    backgroundColor: "transparent",
    marginBottom: 10,
    marginTop: 10,
    //borderColor: "#ADBCBE",
    borderColor: Colors.landingBlue,
    //borderColor: "#C0D0E1",
    borderWidth: 2.5,
    //borderBottomWidth: 4,
    //borderRightWidth: 4
  },
  btnTitles: {
    textAlign: "center",
    fontSize: 19,
    //color: "#42190D",
    color: Colors.floaterCream,
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: 700,
    letterSpacing: 2,
    //paddingBottom: 500,
  },
});

export default LandingScreen;
