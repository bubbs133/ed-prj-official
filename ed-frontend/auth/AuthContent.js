import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useState } from "react";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentials, setCredentials] = useState({
    email: false,
    password: false,
  });

  return (
    <View>
      <Text>AuthContent</Text>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({});
