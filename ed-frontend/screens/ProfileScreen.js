import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";
import ImagePicker from "../components/ImagePicker";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";

function ProfileScreen() {
  function settingsHandler() {
    console.log("settings");
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView>
          <View>
            <Text> Username Here </Text>
            <View>
              <ImagePicker />
            </View>
          </View>
          <MainButton buttonTitle={"Settings"} handler={settingsHandler} />
          <View>
            <Text>My Account</Text>
            <View>
              <Text>Change username</Text>
              <Text>Change password</Text>
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
    backgroundColor: Colors.lightNeutral,
    alignItems: "center",
    justifyContent: "center",
  },
  topContainer: {
    //marginTop: "20%",
  },
});

export default ProfileScreen;
