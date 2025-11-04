import { View, Text, TextInput, StyleSheet } from "react-native";

function Input({ lable, textInputConfig }) {
  return (
    <View>
      <Text style={styles.textLabel}>{lable}</Text>
      <TextInput style={styles.loginInputBox} {...textInputConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  textLabel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  loginInputBox: {
    borderWidth: 3.3,
    borderRadius: 50,
    height: 35,
    flexDirection: "row",
    borderColor: "#DBE6F1"
  },
});

export default Input;
