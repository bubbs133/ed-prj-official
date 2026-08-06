import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QUESTS } from "../models/quests";
import GoBack from "../components/GoBack";
import { useEffect, useState, useRef } from "react";
import ImagePicker from "../components/ImagePicker";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";

import { SwiperFlatList } from "react-native-swiper-flatlist";

function DailyQuestScreen({ navigation }) {
  return (
    <View style={{ resizeMode: "cover", flex: 1 }}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.mainContentContainer}>
          <View>
            <GoBack navigation={navigation} />
          </View>
          <View style={styles.top}>
            <Text style={[styles.heading, styles.globalFont]}>
              Daily Quests
            </Text>
            <Text style={[styles.screenInfo, styles.globalFont]}>
              Challenge yourself and your mind by completing quests. Stepping
              out of your bubble will help you reveal your hidden strengths!
            </Text>
          </View>
          <FlatList
            style={styles.sv}
            data={QUESTS}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 10,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.questCard}
                onPress={() =>
                  navigation.navigate("SelectedQuest", { questId: item.id })
                }
              >
                <Text style={[styles.globalFont, { textAlign: "center",}]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          ></FlatList>
        </View>
      </SafeAreaView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: Colors.lightNeutral,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingHorizontal: "5%",
  },
  sv: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  questImg: {
    flex: 1,
    resizeMode: "cover",
  },
  questCard: {
    backgroundColor: Colors.greyish,
    height: 150,
    width: "48%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  },
  questContainer: {
    flex: 1,
    width,
    justifyContent: "flex-end",
    marginBottom: "30%",
  },
  questGoBtn: {
    textAlign: "center",
  },
  questName: {
    fontSize: 20,
    fontFamily: "Afacad",
    fontWeight: 500,
    textAlign: "center",
  },
  questText: {
    fontFamily: "Afacad",
    //fontWeight: 400,
    letterSpacing: 1,
    fontSize: 16,
    paddingBottom: 20,
    textAlign: "center",
  },
  stop: {
    width: "70%",
    marginVertical: 25,
    paddingBottom: 40,
  },

  shell: {
    alignItems: "center",
    justifyContent: "center",
  },
  screenInfo: {
    marginBottom: 25,
    fontSize: 15,
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  heading: {
    fontSize: 23,
    justifyContent: "flex-start",
    fontWeight: 500,
    letterSpacing: 1,
  },
  mainContentContainer: {
    marginHorizontal: "5%",
  },
});

export default DailyQuestScreen;
