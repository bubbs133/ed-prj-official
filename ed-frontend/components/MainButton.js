import { View, Text, StyleSheet, Pressable } from "react-native";
import Colors from "../constants/colors";
//import Icon from "react-native-vector-icons/FontAwesome";

function MainButton({ buttonTitle, handler }) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.buttonBox,
          pressed ? styles.buttonPressed : styles.buttonBox,
        ]}
        onPress={handler}
      >
        <Text style={styles.buttonTitle}>{buttonTitle}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBox: {
    borderRadius: 50,
    height: 37,
    width: 300,
    backgroundColor: "#F0F0F0",
    marginBottom: 10,
    marginTop: 10,
    borderColor: "#42190D",
    //borderColor: "#9B8E75",
    borderWidth: 2,
  },
  buttonTitle: {
    textAlign: "center",
    fontSize: 19,
    color: "#42190D",
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: 500,
    letterSpacing: 2,
  },
  buttonPressedTitle: {
    color: "#42190D",
    opacity: 0.05,
    textAlign: "center",
    fontSize: 19,
  },
  buttonPressed: {
    backgroundColor: Colors.darkNeutral,
    opacity: 0.05,
  },
});

export default MainButton;
