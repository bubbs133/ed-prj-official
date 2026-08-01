import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
//import Icon from "react-native-vector-icons/FontAwesome";

function ReadsList({ readId, itemTitle, imgPath, details, height, width, navigation }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  return (
    <View style={{ paddingBottom: 5 }}>
      <View
        style={{
          flex: 1,
          borderRadius: 25,
          marginBottom: 16,
          height: "auto",
          width: "auto",
          backgroundColor: Colors.greyish,
          flexDirection: "column",
          padding: 5,
          paddingBottom: 15,
        }}
      >
        <View style={styles.right}>
          <Text style={[styles.itemTitle, styles.globalFont]}>{itemTitle}</Text>
          <Text style={[styles.details, styles.globalFont]}>{details}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Read", { readId})}
          >
            <Ionicons
              name="book-outline"
              size={18}
              color={Colors.darkNeutral}
            />
            <Text style={[styles.actionText, styles.globalFont]}>
              Read More
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingLeft: 5,
  },
  itemTitle: {
    fontSize: 17,
    fontFamily: "Afacad",
    fontWeight: 700,
    letterSpacing: 2,
    marginLeft: 15,
    marginTop: 4,
    paddingBottom: 7,
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
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.seaBlue2,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 15,
    marginTop: 15,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionText: {
    color: Colors.darkNeutral,
    marginLeft: 6,
    fontWeight: "500",
  },
});

export default ReadsList;
