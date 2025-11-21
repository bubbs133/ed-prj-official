import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import Colors from "../constants/colors";
//import Icon from "react-native-vector-icons/FontAwesome";

function Boxes({ itemTitle, description, imgPath, style }) {
  return (
    <View style={[styles.itemBox, style]}>
      <Image source={imgPath} style={styles.img}></Image>
      <View style={styles.bottom}>
        <Text style={[styles.itemTitle, styles.globalFont]}>{itemTitle}</Text>
        <Text style={[styles.description, styles.globalFont]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemBox: {
    borderRadius: 25,
    //borderWidth: 2,
    //marginLeft: "7%"
    //borderColor: Colors.darkNeutral
    borderBottomWidth: 3,
    borderRightWidth: 3,
    flexDirection: "column",
    justifyContent: "space-evenly",
    //height: 170,
    //width: 200,
    //paddingLeft: 10,
  },
  globalFont: {
    fontFamily: "Afacad",
    //fontWeight: 500,
    color: Colors.darkNeutral,
  },
  /*top: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5
    //alignItems: 'center'
  },*/
  bottom: {
    marginTop: -20
  },
  itemTitle: {
    fontSize: 17,
    fontFamily: "Afacad",
    fontWeight: 700,
    letterSpacing: 3,
    marginLeft: 15,
    //paddingBottom: 13,
    marginTop: 5,
    //paddingLeft: 5
  },
  description: {
    fontSize: 14,
    fontFamily: "Afacad",
    fontWeight: 400,
    letterSpacing: 1,
    marginLeft: 15,
  },
  img: {
    width: 57,
    height: 57,
    marginTop: -10,
    marginLeft: 10,
    //paddingRight: 10
    //paddingLeft: -10
  },
});

export default Boxes;
