import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/colors";

function OutlineBtn({ buttonTitle, handler }) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.buttonOutline} onPress={handler}>
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
  buttonOutline: {
    width: "100%",
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bgColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderColor: Colors.homeBlue,
    borderWidth: 2,

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
    letterSpacing: 1,
  },
});

export default OutlineBtn;
