import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

function JournalScreen() {
    function displayDate() {
        const today = new Date();
        const month = today.toLocaleDateString('en-US', { month: 'long' });
        const dayNumber = today.getDate();
        const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

        const formattedDate = `${month} ${dayNumber}`
        const dayNameFormatted = `${dayName}`
        
        return [formattedDate, dayNameFormatted]
    }
    const date = displayDate()
  return (
    <View style={styles.container}>
      <Text>{date[0]}</Text>
      <Text>{date[1]}</Text>
      <Text>What's on your mind?</Text>
      <TextInput style={styles.journalEntryBox}></TextInput>
      <Pressable>
        <Text>Submit</Text>
      </Pressable>
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
  journalEntryBox: {
    borderColor: "#000",
    borderWidth: 1,
    width: "90%",
    height: "50%",
  }
});

export default JournalScreen;
