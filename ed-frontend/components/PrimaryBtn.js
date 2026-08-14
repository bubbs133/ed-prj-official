import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";

function PrimaryBtn({ buttonTitle, handler }) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handler}>
        <Text style={[styles.buttonText, styles.globalFont]}>
          {buttonTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
    color: Colors.darkBlueText,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.homeBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1
  },
});

export default PrimaryBtn;
