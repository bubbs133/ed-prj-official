import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef, useContext } from "react";
import { foodFacts } from "../models/foodFacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Boxes from "../components/Boxes";
import Colors from "../constants/colors";
import { AuthContext } from "../auth/auth-context";

function HomeScreen({ navigation }) {
  const authCtx = useContext(AuthContext);

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
    //console.log("quests btn");
  }

  function journalHandler() {
    navigation.navigate("Journal");
  }

  function izzyHandler() {
    navigation.navigate("Chatbot");
  }

  function assessmentHandler() {
    navigation.navigate("Assessment");
  }

  function trackingHandler() {
    navigation.navigate("Tracking");
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <View>
            <Text style={[styles.introText, styles.globalFont]}>
              Hi {authCtx.username}!{"\n"}
            </Text>
          </View>
          <View style={styles.factContainer}>
            <View style={styles.factText}>
              <Text style={[styles.duk, styles.globalFont]}>
                Did you know...
              </Text>
              <Text style={styles.fact} numberOfLines={4} ellipsizeMode="tail">
                {rndFoodFact ? rndFoodFact.fact : "fact blank"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.homeViews}>
          <View>
            <Text style={[styles.headings, styles.globalFont]}>
              Daily Activities
            </Text>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
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
                    style={{
                      borderColor: Colors.darkBlue,
                      backgroundColor: Colors.lightBlue,
                    }}
                    itemTitle="Quests"
                    description="Challenge yourself and your mind by completing quests."
                    imgPath={require("../assets/staroutline.png")}
                  />
                </Pressable>
              </View>
              <Pressable style={styles.scrollItemPress} onPress={izzyHandler}>
                <Boxes
                  style={{
                    borderColor: Colors.darkPink,
                    backgroundColor: Colors.lightPink,
                  }}
                  itemTitle="Izzy the Chatbot"
                  description="Chat with Izzy to understand eating disorders and nutrition."
                  imgPath={require("../assets/pinkbubbleoutline.png")}
                />
              </Pressable>
              <Pressable
                style={styles.scrollItemPress}
                onPress={journalHandler}
              >
                <Boxes
                  style={{
                    borderColor: Colors.darkGreen,
                    backgroundColor: Colors.lightGreen,
                  }}
                  itemTitle="Journal"
                  description="Set your thoughts and feelings free by journaling."
                  imgPath={require("../assets/greenbook.png")}
                />
              </Pressable>
            </ScrollView>
          </View>
          <View>
            <Text style={[styles.headings, styles.globalFont]}>Check-In</Text>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              horizontal={true}
              overScrollMode="never"
              showsHorizontalScrollIndicator={false}
            >
              <Pressable style={styles.scrollItemPress} onPress={trackingHandler}>
                <Boxes
                  style={{
                    borderColor: Colors.darkGreen,
                    backgroundColor: Colors.lightGreen,
                  }}
                  itemTitle="Care Log"
                  description="Gently observe your nourishment, emotions, and movement."
                  imgPath={require("../assets/foodgreen.png")}
                />
              </Pressable>
              <Pressable
                style={[
                  styles.scrollItemPress,
                  {
                    backgroundColor: Colors.lightPink,
                    borderRadius: 25,
                    borderColor: Colors.darkPink,
                  },
                ]}
                onPress={assessmentHandler}
              >
                <Boxes
                  style={{
                    borderColor: Colors.darkPink,
                    backgroundColor: Colors.lightPink,
                  }}
                  itemTitle="Self-Assessment"
                  description="Take the self-assessment to check in on your symptoms."
                  imgPath={require("../assets/quizpink.png")}
                />
              </Pressable>
            </ScrollView>
          </View>
          <View>
            <Text style={[styles.headings, styles.globalFont]}>Resources</Text>
            <Pressable
              style={styles.scrollItemPressResources}
              onPress={questHandler}
            >
              <Boxes
                style={[styles.resourcesBox]}
                itemTitle="Resources"
                description="Check out this list of offical resources regarding eating disorders, nutrition, and where you can find professional help near you."
                imgPath={require("../assets/listblue.png")}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    //marginTop: "-3%",
    //marginLeft: '5%',
    //marginRight: '5%',
    //backgroundColor: "#DBE6F1",
  },
  /*backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },*/
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
  globalFont: {
    fontFamily: "Afacad",
    //fontWeight: 500,
    color: Colors.darkNeutral,
  },
  introText: {
    //marginTop: "20%",
    marginLeft: "5%",
    marginRight: "5%",
    fontSize: 23,
    letterSpacing: 2,
    fontWeight: 500,
  },
  duk: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: 1,
    marginLeft: "3%",
    marginTop: "3%",
  },
  fact: {
    letterSpacing: 1,
    fontFamily: "Afacad",
    fontSize: 15,
    color: Colors.darkNeutral,
    padding: 10,
  },
  headings: {
    fontWeight: 700,
    letterSpacing: 2,
    paddingBottom: 10,
    fontSize: 17,
    marginLeft: "5%",
  },
  factContainer: {
    marginLeft: "5%",
    marginRight: "5%",
    //paddingBottom: "8%",
    marginTop: "-3%",
    marginBottom: 25,
    //backgroundColor: Colors.lightGrey2,
    //borderColor: Colors.lightGrey,
    borderBottomWidth: 3,
    backgroundColor: Colors.lightBrown,
    borderColor: Colors.darkBrown,
    borderRightWidth: 3,
    borderRadius: 25,
    //borderRadius: 25,
    //borderWidth: 2.6,
    //borderColor: "#000",
    //borderBottomWidth: 4.5,
    //borderRightWidth: 4.5,
  },
  scrollContent: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 20,
  },
  scrollItemPressResources: {
    width: "90%",
    //height: 250,
    marginLeft: "5%",
  },
  scrollItemPress: {
    flexDirection: "row",
    height: 170,
    width: 200,
    //gap: 100,
    //marginLeft: "5%",
  },
  itemBg: {
    resizeMode: "cover",
    //zIndex: 2,
  },
  itemBgImg: {
    resizeMode: "cover",
    height: 193,
    width: 163,
    borderRadius: 100,
  },
  resourcesBox: {
    backgroundColor: Colors.lightBlue,
    borderColor: Colors.darkBlue
  },
});

export default HomeScreen;
