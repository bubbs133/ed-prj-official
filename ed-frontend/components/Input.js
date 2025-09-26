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
    borderWidth: 2.2,
    borderRadius: 50,
    height: 35,
    flexDirection: "row",
  },
});

export default Input;
