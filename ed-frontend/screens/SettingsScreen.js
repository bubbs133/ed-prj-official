import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import GoBack from "../components/GoBack";

function SettingsScreen({ navigation }) {
  
  return (
    <ImageBackground
      source={require("../assets/settingsbg.png")}
      style={styles.backgroundImg}
    >
      <SafeAreaView>
        <View>
          <View style={styles.contentContainer}>
            <View>
              <GoBack navigation={navigation}/>
              <Text style={[styles.header, styles.globalFont]}>Settings</Text>
            </View>
            <View style={styles.element}>
              <Text style={[styles.section, styles.globalFont]}>Account Management</Text>
              <Ionicons name="chevron-forward-outline" />
            </View>
            <View style={styles.element}>
              <Text style={[styles.section, styles.globalFont]}>Notifications</Text>
              <Ionicons name="chevron-forward-outline" />
            </View>
            <View style={styles.element}>
              <Text style={[styles.section, styles.globalFont]}>Privacy and Data</Text>
              <Ionicons name="chevron-forward-outline" />
            </View>
            <View style={styles.element}>
              <Text style={[styles.section, styles.globalFont]}>Help Center</Text>
              <Ionicons name="chevron-forward-outline" />
            </View>
            <View style={styles.element}>
              <Text style={[styles.section, styles.globalFont]}>Future Updates</Text>
              <Ionicons name="chevron-forward-outline" />
            </View>
            <View style={styles.element}>
              <Text style={[styles.section, styles.globalFont]}>Logout</Text>
              {/*<Ionicons name="chevron-forward-outline" />*/}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightNeutral,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  backgroundImg: {
    resizeMode: "stretch",
    flex: 1,
  },
  contentContainer: {
    //marginTop: "17%",
    paddingLeft: "5%",
    paddingRight: "5%",
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
    fontSize: 16
  }
});
