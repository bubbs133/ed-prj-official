import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <GoBack navigation={navigation}/>
      <SwiperFlatList
        autoplay={false}
        showPagination={false}
        data={QUESTS}
        renderItem={({ item }) => (
          <ImageBackground style={styles.questImg} source={item.img}>
            <View style={styles.questContainer}>
              <View style={styles.questCard}>
                <Text style={styles.questName}>
                  {item.name ? item.name : "name blank"}
                </Text>
                <Text style={styles.questText}>
                  {item ? item.description : "description blank"}
                </Text>
              </View>
              <View style={styles.questSelectionBtn}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("SelectedQuest", { questId: item.id })
                  }
                >
                  <Text style={[styles.globalFont, styles.questGoBtn]}>
                    Let's do this!
                  </Text>
                </Pressable>
              </View>
            </View>
          </ImageBackground>
        )}
      />
    </SafeAreaView>
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
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  questImg: {
    flex: 1,
    resizeMode: "cover",
  },
  questCard: {
    marginHorizontal: "5%"
  },
  questContainer: {
    flex: 1,
    width,
    justifyContent: "flex-end",
    marginBottom: "30%",
  },
  questGoBtn: {
    textAlign: "center"
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
});

export default DailyQuestScreen;
