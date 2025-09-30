import { Pressable, StyleSheet, Text, View } from "react-native";
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
    <View style={styles.container}>
      <View>
        <Pressable onPress={loginButtonHandler}>
          <Text style={styles.btnTitles}>Login</Text>
        </Pressable>
      </View>
      <View>
        <Pressable onPress={signupButtonHandler}>
          <Text style={styles.btnTitles}>Sigup</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  btnTitles: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default LandingScreen;
