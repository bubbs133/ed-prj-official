import { View, Text, StyleSheet, Pressable } from "react-native";
import Colors from "../constants/colors";
//import Icon from "react-native-vector-icons/FontAwesome";

function MainButton({ buttonTitle, handler }) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.buttonBox,
          pressed ? styles.optionsBoxPressed : styles.optionsBoxUnpressed,
        ]}
        onPress={handler}
      >
        {({ pressed }) => (
          <Text
            style={[
              styles.buttonTitle,
              pressed ? styles.textPressed : styles.textUnpressed,
            ]}
          >
            {buttonTitle}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonTitle: {
    textAlign: "center",
    fontSize: 19,
    color: "#42190D",
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: 400,
    letterSpacing: 2,
    paddingBottom: 10
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
  buttonBox: {
    height: 32,
    width: 300,
    borderWidth: 2,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderColor: Colors.darkNeutral,
  },
  optionsBoxUnpressed: {
    borderColor: Colors.darkNeutral,
  },
  optionsBoxPressed: {
    borderColor: "#77605A",
    backgroundColor: "#77605A",
  },
  textPressed: {
    color: Colors.lightNeutral,
  },
  textUnpressed: {
    color: Colors.darkNeutral,
  },
});

export default MainButton;
