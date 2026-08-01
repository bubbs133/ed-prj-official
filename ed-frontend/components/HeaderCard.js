import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";
import GoBack from "../components/GoBack";

function HeaderCard({ navigation }) {
  return (
    <View style={styles.container}>
      <GoBack navigation={navigation} />
      <Text style={[styles.globalFont, styles.title]}>
        Find Professional Help
      </Text>

      <Text style={[styles.subtitle, styles.globalFont]}>
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
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  wave: {
    fontSize: 34,
    marginBottom: 8,
  },

  title: {
    fontSize: 23,
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: Colors.darkNeutral,
    fontFamily: "Afacad",
  },
});
