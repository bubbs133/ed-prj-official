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
    <ImageBackground
      source={require("../assets/quests/sand.png")}
      style={{ resizeMode: "cover", flex: 1 }}
    >
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <GoBack navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.sv}
          contentContainerStyle={styles.scrollContent}
        >
          {QUESTS.map((quest, index) => (
            <View
              key={quest.id}
              style={[
                styles.stop,
                {
                  alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
                },
              ]}
            >
              <Pressable
                onPress={() =>
                  navigation.navigate("SelectedQuest", { questId: quest.id })
                }
              >
                <View style={styles.shell}>
                  <Image source={require('../assets/quests/shell.png')} style={{ width: 30, height: 30, resizeMode: 'cover', flex: 1}}/>
                </View>
                
                <Text style={[styles.globalFont, {textAlign: "center"}]}>{quest.name}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: Colors.lightNeutral,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  sv: {
    flex: 1,
    paddingBottom: -100
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
    marginHorizontal: "5%",
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
    paddingBottom: 40
  },

  shell: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DailyQuestScreen;
