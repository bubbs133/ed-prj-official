import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

function GoBack({ navigation }) {
  function backHandler() {
    navigation.goBack();
  }
  return (
    <View>
      <Pressable style={styles.backArrow} onPress={backHandler}>
        <Ionicons name="chevron-back-outline" size={30} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backArrow: {
    marginBottom: 10,
    marginTop: 10,
    left: 0,
    marginRight: 0,
    //position: "absolute"
  },
});

export default GoBack;
