import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
  ImageBackground,
  Image,
  Button,
  Modal,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef, useContext } from "react";
import { useRoute } from "@react-navigation/native";
import { foodFacts } from "../models/foodFacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Boxes from "../components/Boxes";
import Colors from "../constants/colors";
import { AuthContext } from "../auth/auth-context";
import { RESOURCES } from "../models/resources";

function HomeScreen({ navigation }) {
  const [activeModal, setActiveModal] = useState(false);
  const authCtx = useContext(AuthContext);

  const [rndFoodFact, setRndFoodFact] = useState(null);
  const [minute, setMinute] = useState(new Date().getMinutes());
  const prevMin = useRef(minute);

  //const [clusterPred, setClusterPred] = useState(null);

  const route = useRoute();
  const result = route.params?.result;

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

  function renderItem({ item }) {
    return (
      <View style={styles.resourceContainer}>
        <Pressable onPress={() => Linking.openURL(item.resource)}>
          <Text style={[styles.resourceHeading, styles.globalFont]}>
            {item.resourceName}
          </Text>
          <Text style={styles.globalFont}>{item.resourceDetails}</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <View>
            <Text style={[styles.introText, styles.globalFont]}>
              Hi {authCtx.username}!{"\n"}
            </Text>
            <Text>{result ? `Result: ${result}`: "No result"}</Text>
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
  backgroundImg: {
    resizeMode: "stretch",
    flex: 1,
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
    borderColor: Colors.darkBlue,
  },
  resourcesModalInnerContainer: {
    flex: 1,
  },
  modalHeading: {
    textAlign: "center",
    marginLeft: 0,
  },
  resourceContainer: {
    padding: 16,
  },
  resourceHeading: {
    fontSize: 17,
    fontWeight: 500,
    letterSpacing: 1,
  },
});

export default HomeScreen;
