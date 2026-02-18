import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";
import ImagePicker from "../components/ImagePicker";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import { Ionicons } from "@expo/vector-icons";

function ProfileScreen({ navigation }) {
  function settingsHandler() {
    console.log("settings");
    navigation.navigate("Settings");
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top', 'left', 'right']}>
          <View style={styles.contentContainer}>
            <View style={styles.bars}>
              <Pressable onPress={settingsHandler}>
                <Ionicons name="reorder-three-outline" size={34} />
              </Pressable>
            </View>
            <View style={styles.top}>
              <Image
                source={require("../assets/apppfp.jpg")}
                style={styles.pfppic}
              />
              <Text style={[styles.globalFont, styles.profilename]}>
                {" "}
                Bubbs{" "}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: Colors.lightNeutral,
    //alignItems: "center",
    //justifyContent: "center",
  },
  backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },
  contentContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  bars: {
    //justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  top: {
    //alignContent: "center",
    alignItems: "center",
  },
  profilename: {
    fontWeight: 500,
    fontSize: 20,
    paddingTop: 10
  },
  pfppic: {
    resizeMode: "cover",
    flex: 1,
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: Colors.darkNeutral,
    height: 110,
    width: 110,
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
});

export default ProfileScreen;
