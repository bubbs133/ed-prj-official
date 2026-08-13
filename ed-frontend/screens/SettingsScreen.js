import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../auth/auth-context";
import Colors from "../constants/colors";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import GoBack from "../components/GoBack";

function SettingsScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  async function logoutHandler() {
    await logout();
    //navigation.navigate("LoginScreen");
  }
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={styles.outerContainer}
    >
      <ImageBackground
        source={require("../assets/main/settings.png")}
        style={styles.backgroundImg}
      >
        <View style={styles.contentContainer}>
          <View>
            {/*<GoBack navigation={navigation} />*/}
            <Text style={[styles.header, styles.globalFont]}>Settings</Text>
          </View>
          <View style={styles.element}>
            <Text style={[styles.section, styles.globalFont]}>
              Account Management
            </Text>
            <Ionicons name="chevron-forward-outline" />
          </View>
          <View style={styles.element}>
            <Text style={[styles.section, styles.globalFont]}>
              Notifications
            </Text>
            <Ionicons name="chevron-forward-outline" />
          </View>
          <View style={styles.element}>
            <Text style={[styles.section, styles.globalFont]}>
              Privacy and Data
            </Text>
            <Ionicons name="chevron-forward-outline" />
          </View>
          <View style={styles.element}>
            <Text style={[styles.section, styles.globalFont]}>Help Center</Text>
            <Ionicons name="chevron-forward-outline" />
          </View>
          <View style={styles.element}>
            <Text style={[styles.section, styles.globalFont]}>
              Future Updates
            </Text>
            <Ionicons name="chevron-forward-outline" />
          </View>
          <View style={styles.element}>
            <TouchableOpacity onPress={logoutHandler}>
              <Text style={[styles.section, styles.globalFont]}>Logout</Text>
            </TouchableOpacity>
            {/*<Ionicons name="chevron-forward-outline" />*/}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
    marginTop: 30
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    //fontSize: 16,
    color: Colors.darkNeutral,
  },
  header: {
    fontWeight: 500,
    fontSize: 23,
  },
  element: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0,
  },
  section: {
    fontSize: 16,
  },
  backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },
});
