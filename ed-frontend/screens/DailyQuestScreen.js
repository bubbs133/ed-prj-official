import { StyleSheet, Text, View } from "react-native";
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
    }, 10000);

    return () => clearInterval(interval);
  }, [day]);

  return (
    <View style={styles.container}>
      <View>
        <Text>DailyQuest</Text>
        <Text>{rndQuest ? rndQuest.name : "name blank"}</Text>
        <Text>{rndQuest ? rndQuest.description : "description blank"}</Text>
      </View>
      <View>
        <ImagePicker/>
      </View>
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
});

export default DailyQuestScreen;
