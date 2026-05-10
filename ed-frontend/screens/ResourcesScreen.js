import { StyleSheet, Text, View } from "react-native";
import React from "react";

function ResourcesScreen() {
  return (
    <View>
      <View>
        <View>
          <GoBack navigation={navigation} />
        </View>
        <View style={styles.top}>
          <Text style={[styles.heading, styles.globalFont]}>Resources</Text>
          <Text style={[styles.screenInfo, styles.globalFont]}>
            Learn about eating disorders, what keeps them going, and how to
            approach a healthy settlement with yourself and your mind.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 23,
    justifyContent: "flex-start",
    fontWeight: 500,
    letterSpacing: 1,
  },
  screenInfo: {
    marginBottom: 25,
    fontSize: 15,
  },
});

export default ResourcesScreen;
