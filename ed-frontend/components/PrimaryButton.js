import { View, Text, StyleSheet, Pressable } from "react-native";
import Colors from "../constants/colors";
//import Icon from "react-native-vector-icons/FontAwesome";

function MainButton({ buttonTitle, handler, border, fill }) {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.btn}>
        <Pressable
          style={({ pressed }) => [
            styles.buttonBox,
            pressed
              ? [styles.optionsBoxPressed, { backgroundColor: fill }]
              : [styles.optionsBoxUnpressed, { borderColor: border }],
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
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {},
  buttonTitle: {
    textAlign: "center",
    fontSize: 19,
    color: "#42190D",
    marginTop: 5,
    fontFamily: "Afacad",
    fontWeight: 400,
    letterSpacing: 2,
    paddingBottom: 10,
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
    borderRadius: 50,
    height: 37,
    width: 300,
    backgroundColor: "transparent",
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 3,
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
