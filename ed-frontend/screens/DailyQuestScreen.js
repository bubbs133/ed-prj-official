import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { quests } from "../models/quests";
import { useEffect, useState, useRef } from "react";
import ImagePicker from "../components/ImagePicker";

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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.contentView}>
          <View>
            <Text style={styles.questName}>
              {rndQuest ? rndQuest.name : "name blank"}{"\n"}
            </Text>
            <Text style={styles.questText}>{rndQuest ? rndQuest.description : "description blank"}</Text>
          </View>
          <View>
            <ImagePicker />
          </View>
        </View>
        <Pressable>
          <Text>Submit</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  contentView: {
    marginTop: "35%",
    marginLeft: "5%",
    marginRight: "5%",
  },
  questName: {
    fontSize: 20,
  },
  questText: {
  },
});

export default DailyQuestScreen;
