import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { quests } from "../models/quests";
import GoBack from "../components/GoBack";
import { useEffect, useState, useRef } from "react";
import ImagePicker from "../components/ImagePicker";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";

import { SwiperFlatList } from "react-native-swiper-flatlist";

function DailyQuestScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View>
        <GoBack navigation={navigation} />
      </View>
      <SwiperFlatList
        autoplay={false}
        showPagination={false}
        data={quests}
        renderItem={({ item }) => (
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
  questContainer: {
    flex: 1,
    width,
    justifyContent: "center",
  },
  questCard: {
    height: "70%",
    backgroundColor: "blue",
    width: "90%",
    borderRadius: 20,
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
