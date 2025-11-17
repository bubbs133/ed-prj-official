import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import Colors from "../constants/colors";
//import Icon from "react-native-vector-icons/FontAwesome";

function Boxes({ itemTitle, description, imgPath }) {
  return (
    <View style={styles.itemBox}>
      <View style={styles.top} >
        <Text style={styles.itemTitle}>{itemTitle}</Text>
        <Image source={imgPath} style={styles.img}></Image>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemBox: {
    borderRadius: 25,
    borderWidth: 2,
    //marginLeft: "7%"
    //borderColor: Colors.darkNeutral
    //borderBottomWidth: 4,
    //borderRightWidth: 4,
    //height: 170,
    //width: 200,
    //paddingLeft: 10,
  },
  top: {
    flexDirection: "row",
    justifyContent: 'space-between',
    //alignItems: 'center'
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: "Afacad",
    fontWeight: 700,
    letterSpacing: 3,
    marginLeft: "5%",
    paddingBottom: 13,
    paddingTop: 10,
  },
  description: {
    fontSize: 13,
    fontFamily: "Afacad",
    fontWeight: 400,
    letterSpacing: 1,
    paddingLeft: 10,
  },
  img: {
    width: 30,
    height: 30,
    //paddingRight: 10
  }
});

export default Boxes;