import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { foodFacts } from "../models/foodFacts";
import AsyncStorage from "@react-native-async-storage/async-storage";

function HomeScreen({ navigation }) {
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

  function questHandler() {
    navigation.navigate("Quests");
    console.log("quests btn");
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <View>
            <Text style={styles.introText}>Hi User!{"\n"}</Text>
          </View>
          <View style={styles.factContainer}>
            <Text>Did you know...</Text>
            <Text numberOfLines={3} ellipsizeMode="tail">
              {rndFoodFact ? rndFoodFact.fact : "fact blank"}
              {"\n"}
            </Text>
          </View>
        </View>
        <View style={styles.homeViews}>
          <View>
            <Text>Daily Activities</Text>
            <ScrollView
              style={styles.scrollView}
              horizontal={true}
              overScrollMode="never"
              showsHorizontalScrollIndicator={false}
            >
              <Pressable style={styles.scrollItem} onPress={questHandler}>
                <Text>Quest</Text>
              </Pressable>
              <Pressable style={styles.scrollItem} onPress={questHandler}>
                <Text>Journal</Text>
              </Pressable>
              <Pressable style={styles.scrollItem} onPress={questHandler}>
                <Text>Music</Text>
              </Pressable>
            </ScrollView>
          </View>
          <View>
            <Text>Check-In</Text>
            <ScrollView
              style={styles.scrollView}
              horizontal={true}
              overScrollMode="never"
              showsHorizontalScrollIndicator={false}
            >
              <Pressable style={styles.scrollItem} onPress={questHandler}>
                <Text>Journal</Text>
              </Pressable>
              <Pressable style={styles.scrollItem} onPress={questHandler}>
                <Text>Self-Assessment</Text>
              </Pressable>
              <Pressable style={styles.scrollItem} onPress={questHandler}>
                <Text>Music</Text>
              </Pressable>
            </ScrollView>
          </View>
          <View>
            <Text>Resources</Text>
            <Pressable style={styles.scrollItem} onPress={questHandler}>
              <Text>Recourses</Text>
            </Pressable>
          </View>
                    <View>
            <Text>Resources</Text>
            <Pressable style={styles.scrollItem} onPress={questHandler}>
              <Text>Recourses</Text>
            </Pressable>
          </View>
        </View>
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
  topContainer: {
    marginTop: "-3%",
    //marginLeft: '5%',
    //marginRight: '5%',
    backgroundColor: "#DBE6F1",
    borderRadius: "13%",
  },
  introText: {
    marginTop: "20%",
    marginLeft: "5%",
    marginRight: "5%",
  },
  factContainer: {
    marginLeft: "5%",
    marginRight: "5%",
    paddingBottom: "8%",
  },
  scrollView: {
    flexDirection: "row",
  },
  scrollItem: {
    backgroundColor: "#a1cad3ff",
    height: 170,
    width: 200,
    marginRight: 20,
  },
  homeViews: {
    marginLeft: "5%",
  },
});

export default HomeScreen;
