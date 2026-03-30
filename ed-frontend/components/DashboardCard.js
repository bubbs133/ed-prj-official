import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import Colors from "../constants/colors";
//import Icon from "react-native-vector-icons/FontAwesome";

function DashboardCard({
  itemTitle,
  details,
  height,
  width,
  borderColor,
  fillColor,
  fontColor
}) {
  return (
    <View
      style={{
        //flex: 1,
        borderBottomWidth: 3.5,
        borderRightWidth: 3.5,
        borderRadius: 25,
        //margin: 0,
        marginBottom: 10,
        height: height,
        width: width,
        borderColor: borderColor,
        backgroundColor: fillColor,
        color: fontColor
      }}
    >
      <View style={styles.bottom}>
        <Text style={[styles.itemTitle, styles.globalFont]}>{itemTitle}</Text>
        <Text style={[styles.details, styles.globalFont]}>
          {details}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
   //color: Colors.darkNeutral,
   //color: Colors.whiteish
  },
  bottom: {
    marginTop: -5,
    marginRight: 0,
  },
  itemTitle: {
    fontSize: 17,
    fontFamily: "Afacad",
    fontWeight: 700,
    letterSpacing: 2,
    marginLeft: 15,
    marginTop: 15,
  },
  details: {
    fontSize: 14,
    fontFamily: "Afacad",
    fontWeight: 400,
    letterSpacing: 1,
    marginLeft: 15,
  },
});

export default DashboardCard;
