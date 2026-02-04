import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import Colors from "../constants/colors";
//import Icon from "react-native-vector-icons/FontAwesome";

function Boxes({
  itemTitle,
  description,
  imgPath,
  height,
  width,
  borderColor,
  fillColor,
}) {
  return (
    <View
      style={{
        //flex: 1,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderRadius: 25,
        //margin: 0,
        marginBottom: 10,
        height: height,
        width: width,
        borderColor: borderColor,
        backgroundColor: fillColor,
      }}
    >
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
  globalFont: {
    fontFamily: "Afacad",
    color: Colors.darkNeutral,
  },
  bottom: {
    marginTop: -5,
    marginRight: 0,
  },
  itemTitle: {
    fontSize: 17,
    fontFamily: "Afacad",
    fontWeight: 700,
    letterSpacing: 3,
    marginLeft: 15,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    fontFamily: "Afacad",
    fontWeight: 400,
    letterSpacing: 1,
    marginLeft: 15,
  },
  img: {
    width: 50,
    height: 50,
    marginTop: 5,
    marginLeft: 10,
    //paddingRight: 10
    //paddingLeft: -10
  },
});

export default Boxes;
