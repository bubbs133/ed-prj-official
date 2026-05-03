import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
//import Icon from "react-native-vector-icons/FontAwesome";

function ReadsList({ itemTitle, imgPath, details, height, width }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  return (
    <View
      style={{
        flex: 1,
        //borderBottomWidth: 3.5,
        //borderRightWidth: 3.5,
        borderRadius: 25,
        //margin: 0,
        marginBottom: 10,
        height: "auto",
        width: "auto",
        //borderColor: Colors.lightCoffeeBrown,
        backgroundColor: Colors.greyish,
        color: Colors.coffeeBrown,
        flexDirection: "row",
        padding: 5,
      }}
    >
      <View style={styles.left}>
        <Image source={imgPath} style={styles.img}></Image>
      </View>
      <View style={styles.right}>
        <Text style={[styles.itemTitle, styles.globalFont]}>{itemTitle}</Text>
        <Text style={[styles.details, styles.globalFont]}>{details}</Text>
      </View>
      <Pressable
        style={styles.bookmark}
        onPress={() => setIsBookmarked(!isBookmarked)}
      >
        <Ionicons
          name={isBookmarked ? "bookmark" : "bookmark-outline"}
          color="#42190D"
          size={22}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
    //color: Colors.darkNeutral,
    //color: Colors.whiteish
  },
  right: {
    flex: 1,
  },
  itemTitle: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  details: {
    flexShrink: 1,
  },
  img: {
    height: 150,
    width: 130,
    borderRadius: 10,
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
  bookmark: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
});

export default ReadsList;
