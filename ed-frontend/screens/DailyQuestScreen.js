import { StyleSheet, Text, View } from "react-native";

function DailyQuestScreen() {
  return (
    <View style={styles.container}>
      <Text>DailyQuest</Text>
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

export default DailyQuestScreen;
