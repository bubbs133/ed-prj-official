import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
  TouchableOpacity,
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
      style={{ flex: 1, width: "!00%", alignItems: "center" }}
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
              <View
                style={{ width: "100%" }}
                //onPress={() => navigation.navigate("Read", { readId: item.id })}
              >
                <ReadsList
                  readId={item.id}
                  itemTitle={item.title}
                  imgPath={item.img}
                  details={item.cardSummary}
                  height={120}
                  width={"100%"}
                  navigation={navigation}
                />
              </View>
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
    width: "100%",
    maxWidth: 760,
    flex: 1,
    backgroundColor: Colors.bgColor,
    paddingHorizontal: "5%",
    paddingBottom: "15%",
    paddingTop: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
