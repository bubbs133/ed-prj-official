import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { quests } from "../models/quests";
import { useEffect, useState, useRef } from "react";
import ImagePicker from "../components/ImagePicker";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";

function DailyQuestScreen() {
  const [rndQuest, setRndQuest] = useState(null);
  const [day, setDay] = useState(new Date().getDay());
  const prevDay = useRef(day);

  function generateRandomIndex() {
    //const min = 1;
    //const max = quests.length;
    const rndNum = Math.floor(Math.random() * quests.length);
    return rndNum;
  }

  function generateRndQuest(rndNum) {
    setRndQuest(quests[rndNum]);
  }

  function timeChangeCheck() {
    const today = new Date().getDay();

    if (today !== prevDay.current) {
      prevDay.current == today;
      setDay(today);
      console.log("day updated");
    }
    console.log("time checked");
  }

  useEffect(() => {
    const rndNum = generateRandomIndex();
    generateRndQuest(rndNum);

    const interval = setInterval(() => {
      timeChangeCheck();
    }, 50000);

    return () => clearInterval(interval);
  }, [day]);

  function submitQuest() {
    console.log("quest submit");
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView>
        <View style={styles.contentView}>
          <View>
            <Text style={styles.questName}>
              {rndQuest ? rndQuest.name : "name blank"}
            </Text>
            <Text style={styles.questText}>
              {rndQuest ? rndQuest.description : "description blank"}
            </Text>
          </View>
          <View style={styles.imgContainer}>
            <ImagePicker />
          </View>
        </View>
        <MainButton buttonTitle={"Submit"} handler={submitQuest} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: Colors.lightNeutral,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },
  contentView: {
    //marginTop: "17%",
    marginLeft: "5%",
    marginRight: "5%",
  },
  questName: {
    fontSize: 20,
    fontFamily: "Afacad",
    fontWeight: 500,
  },
  questText: {
    fontFamily: "Afacad",
    //fontWeight: 400,
    letterSpacing: 1,
    fontSize: 16,
    paddingBottom: 20,
  },
  imgContainer: {
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    borderStyle: "dashed",
  },
});

export default DailyQuestScreen;
