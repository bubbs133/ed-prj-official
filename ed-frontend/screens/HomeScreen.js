import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
  ImageBackground,
  Image,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { foodFacts } from "../models/foodFacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Boxes from "../components/Boxes";
import Colors from "../constants/colors";

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
            <Text style={styles.duk}>Did you know...</Text>
            <Text style={styles.fact} numberOfLines={4} ellipsizeMode="tail">
              {rndFoodFact ? rndFoodFact.fact : "fact blank"}
            </Text>
          </View>
        </View>
        <View style={styles.homeViews}>
          <View>
            <Text style={styles.headings}>Daily Activities</Text>
            <ScrollView
              style={styles.scrollView}
              horizontal={true}
              overScrollMode="never"
              showsHorizontalScrollIndicator={false}
            >
              <View>
                <Pressable
                  style={styles.scrollItemPress}
                  onPress={questHandler}
                >
                  <Boxes
                    itemTitle="Quests"
                    description="Challenge yourself and your mind by completing quests."
                    imgPath={require("../assets/solar_star-bold.png")}
                  />
                </Pressable>
              </View>
              <Pressable style={styles.scrollItemPress} onPress={questHandler}>
                <Boxes
                  itemTitle="Izzy the Chatbot"
                  description="Chat with Izzy to understand eating disorders and nutrition."
                  imgPath={require("../assets/solar_star-bold.png")}
                />
              </Pressable>
              <Pressable style={styles.scrollItemPress} onPress={questHandler}>
                <Boxes
                  itemTitle="Journal"
                  description="Set your thoughts and feelings free by journaling."
                  imgPath={require("../assets/solar_star-bold.png")}
                />
              </Pressable>
            </ScrollView>
          </View>
          <View>
            <Text style={styles.headings}>Check-In</Text>
            <ScrollView
              style={styles.scrollView}
              horizontal={true}
              overScrollMode="never"
              showsHorizontalScrollIndicator={false}
            >
              <Pressable style={styles.scrollItemPress} onPress={questHandler}>
                <Boxes
                  itemTitle="Journal"
                  description="Set your thoughts and feelings free by journaling."
                  imgPath={require("../assets/solar_star-bold.png")}
                />
              </Pressable>
              <Pressable style={[styles.scrollItemPress, {backgroundColor: Colors.lightPink, borderRadius: 25, borderColor: Colors.darkPink}]} onPress={questHandler}>
                <Boxes
                  itemTitle="Self-Assessment"
                  description="Take the self-assessment to check in on your symptoms."
                  imgPath={require("../assets/solar_star-bold.png")}
                />
              </Pressable>
            </ScrollView>
          </View>
          <View>
            <Text style={styles.headings}>Resources</Text>
            <Pressable
              style={styles.scrollItemPressJournal}
              onPress={questHandler}
            >
              <Boxes
                style={styles.joranl}
                itemTitle="Resources"
                description="Check out this list of offical resources regarding eating disorders, nutrition, and where you can find professional help near you."
                imgPath={require("../assets/solar_star-bold.png")}
              />
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
    backgroundColor: Colors.lightNeutral,
    //backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  topContainer: {
    marginTop: "-3%",
    //marginLeft: '5%',
    //marginRight: '5%',
    //backgroundColor: "#DBE6F1",
  },
  homeViews: {
    //borderTopLeftRadius: "6%",
    //borderTopRightRadius: "6%",
    //borderWidth: 2,
    //borderColor: "#000",
    //backgroundColor: "#fff"
    //paddingLeft: "5%",
    //marginRight: "5%",
    rowGap: 25,
  },
  introText: {
    marginTop: "20%",
    marginLeft: "5%",
    marginRight: "5%",
    fontSize: 23,
    fontFamily: "Afacad",
    fontWeight: 500,
    letterSpacing: 2,
  },
  duk: {
    fontFamily: "Afacad",
    fontWeight: 500,
    letterSpacing: 2,
    fontSize: 14,
  },
  fact: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    fontSize: 14,
  },
  headings: {
    fontFamily: "Afacad",
    fontWeight: 700,
    letterSpacing: 2,
    paddingBottom: 10,
  },
  factContainer: {
    marginLeft: "5%",
    marginRight: "5%",
    paddingBottom: "8%",
    //borderRadius: 25,
    //borderWidth: 2.6,
    //borderColor: "#000",
    //borderBottomWidth: 4.5,
    //borderRightWidth: 4.5,
  },
  scrollView: {
    flexDirection: "row",
  },
  scrollItemPressJournal: {
    width: "95%",
    height: 220,
    backgroundColor: Colors.lightGreen,
  },
  scrollItemPress: {
    flexDirection: "row",
    height: 170,
    width: 200,
    gap: 100,
    marginLeft: "5%"
  },
  itemBg: {
    resizeMode: "cover",
    zIndex: 2,
  },
  itemBgImg: {
    resizeMode: "cover",
    height: 193,
    width: 163,
    borderRadius: 100,
  },
  joranl: {
    backgroundColor: Colors.lightBlue,
  },
});

export default HomeScreen;
