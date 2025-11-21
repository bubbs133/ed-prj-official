import { StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

function SettingsScreen({ navigation }) {
  function backHandler() {
    navigation.navigate("Profile");
  }
  return (
    <SafeAreaView>
      <View>
        <View style={styles.contentContainer}>
          {/*<Pressable onPress={backHandler}>
            <Ionicons name="chevron-back-outline" size={27} />
          </Pressable>*/}
          <View style={styles.element}>
            <Text style={[styles.globalFont]}>Account Management</Text>
            <Ionicons name="chevron-forward-outline" />
          </View>
          <View style={styles.element}>
            <Text style={[styles.globalFont]}>Notifications</Text>
            <Ionicons name="chevron-forward-outline" />
          </View>
          <View style={styles.element}>
            <Text style={[styles.globalFont]}>Privacy and Data</Text>
            <Ionicons name="chevron-forward-outline" />
          </View>
          <View style={styles.element}>
            <Text style={[styles.globalFont]}>Help Center</Text>
            <Ionicons name="chevron-forward-outline" />
          </View>
          <View style={styles.element}>
            <Text style={[styles.globalFont]}>Future Updates</Text>
            <Ionicons name="chevron-forward-outline" />
          </View>
          <View style={styles.element}>
            <Text style={[styles.globalFont]}>Logout</Text>
            {/*<Ionicons name="chevron-forward-outline" />*/}
          </View>
        </View>
      </View>
    </SafeAreaView>
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
  contentContainer: {
    //marginTop: "17%",
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    fontSize: 16,
    color: Colors.darkNeutral
  },
  element: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0,
  },
});
