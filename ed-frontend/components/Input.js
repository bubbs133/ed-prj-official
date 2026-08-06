import { View, Text, TextInput, StyleSheet } from "react-native";
import Colors from "../constants/colors";

function Input({ label, textInputConfig }) {
  return (
    <View>
      <Text style={styles.textLabel}>{label}</Text>
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
    fontFamily: "Afacad",
    letterSpacing: 2,
    fontSize: 16
  },
  loginInputBox: {
    borderWidth: 2,
    borderRadius: 50,
    height: 35,
    flexDirection: "row",
    borderColor: Colors.darkNeutral,
    fontFamily: "Afacad",
    paddingLeft: "3%",
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default Input;
