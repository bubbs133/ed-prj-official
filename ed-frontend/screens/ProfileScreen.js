import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getAuth } from "firebase/auth";

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <Text> Username Here </Text>
          <View></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileScreen;
