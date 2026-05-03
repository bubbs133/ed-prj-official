import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { useState, useEffect, useRef, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import { QUICK_READS } from "../models/reads";
import DashboardCard from "../components/DashboardCard";
import GoBack from "../components/GoBack";
import React from "react";
import ReadsList from "../components/ReadsList";

function QuickReadsListScreen({ navigation }) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainContentContainer}>
          <View>
            <GoBack navigation={navigation} />
          </View>
          <View style={styles.top}>
            <Text style={[styles.heading, styles.globalFont]}>Quick Reads</Text>
            <Text style={[styles.screenInfo, styles.globalFont]}>
              Learn about eating disorders, what keeps them going, and how to
              approach a healthy settlement with yourself and your mind.
            </Text>
          </View>
          <FlatList
            scrollEnabled={false}
            data={QUICK_READS}
            numColumns={1}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={{ width: "100%" }}
                onPress={() => navigation.navigate("Read", { readId: item.id })}
              >
                <ReadsList
                  itemTitle={item.title}
                  imgPath={item.img}
                  details={item.cardSummary}
                  height={120}
                  width={"100%"}
                />
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  mainContentContainer: {
    paddingHorizontal: "5%",
  },
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

export default QuickReadsListScreen;
