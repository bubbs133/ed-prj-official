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
  fontColor,
}) {
  return (
    <View
      style={{
        //flex: 1,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderRadius: 25,
        //margin: 0,
        marginBottom: 10,
        height: height,
        width: width,
        borderColor: borderColor,
        backgroundColor: fillColor,
        color: fontColor,
      }}
    >
      <Image source={imgPath} style={styles.img}></Image>
      <View style={styles.bottom}>
        <Text
          style={[styles.itemTitle, styles.globalFont, { color: fontColor }]}
        >
          {itemTitle}
        </Text>
        <Text
          style={[styles.description, styles.globalFont, { color: fontColor }]}
        >
          {description}
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
    width: 40,
    height: 40,
    marginTop: 13,
    marginLeft: 15,
    marginBottom: 5
    //paddingRight: 10
    //paddingLeft: -10
  },
});

export default Boxes;
