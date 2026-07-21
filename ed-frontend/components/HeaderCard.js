import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";

function HeaderCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.wave}>🌊</Text>

      <Text style={styles.title}>Find Professional Help</Text>

      <Text style={styles.subtitle}>
        Professional support near your current location.
      </Text>
    </View>
  );
}

export default HeaderCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    marginTop: 70,
    marginBottom: 20,
  },

  wave: {
    fontSize: 34,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontFamily: "Afacad",
    color: Colors.darkNeutral,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#777",
    fontFamily: "Afacad",
    lineHeight: 24,
  },
});
