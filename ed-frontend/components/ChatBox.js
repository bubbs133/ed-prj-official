import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import Colors from "../constants/colors";
//import Icon from "react-native-vector-icons/FontAwesome";

function ChatBox({
  name,
  preview,
  imgPath,
  height,
  width,
}) {
  return (
    <View
      style={{
        //flex: 1,
        borderBottomWidth: 2,
        borderColor: Colors.lightGrey2,
        //borderRightWidth: 3,
        //borderRadius: 25,
        //margin: 0,
        //marginBottom: 5,
        height: height,
        width: width,
      }}
    >
      <View style={styles.left}>
        <Image source={imgPath} style={styles.img}></Image></View>
      <View style={styles.right}>
        <Text style={[styles.name, styles.globalFont]}>{name}</Text>
        <Text style={[styles.preview, styles.globalFont]}>
          {preview}
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
  preview: {
    fontSize: 14,
    fontFamily: "Afacad",
    fontWeight: 400,
    letterSpacing: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: 1,
    marginLeft: 15,
  }
});

export default ChatBox;
