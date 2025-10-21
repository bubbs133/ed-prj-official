import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import { foodFacts } from "../models/foodFacts";
import AsyncStorage from "@react-native-async-storage/async-storage";

function HomeScreen() {
  const [rndFoodFact, setRndFoodFact] = useState(null);
  const [minute, setMinute] = useState(new Date().getMinutes());
  const prevMin = useRef(minute);

  function generateRandomIndex() {
    const rndNum = Math.floor(Math.random() * foodFacts.length);
    return rndNum;
  }

  function generateRndFact(rndNum) {
    setRndFoodFact(foodFacts[rndNum]);
  }

  function timeChangeCheck() {
    const today = new Date().getMinutes();

    if (today !== prevMin.current) {
      prevMin.current == today;
      setMinute(today);
      console.log("min updated");
    }
    console.log("time checked");
  }

  useEffect(() => {
    const rndNum = generateRandomIndex();
    generateRndFact(rndNum);

    const interval = setInterval(() => {
      timeChangeCheck();
    }, 50000);

    return () => clearInterval(interval);
  }, [minute]);

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <Text>Hi </Text>
      <Text>{rndFoodFact ? rndFoodFact.fact : "fact blank"}</Text>
      <View>
        <Text>Daily Check-In</Text>
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

export default HomeScreen;
