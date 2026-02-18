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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef, useContext } from "react";
import { useRoute } from "@react-navigation/native";
import { foodFacts } from "../models/foodFacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Boxes from "../components/Boxes";
import Colors from "../constants/colors";
import { AuthContext } from "../auth/auth-context";
import { RESOURCES } from "../models/resources";
import DashboardCard from "../components/DashboardCard";

function HomeScreen({ navigation }) {
  const [activeModal, setActiveModal] = useState(false);
  const authCtx = useContext(AuthContext);

  const [minute, setMinute] = useState(new Date().getMinutes());
  const prevMin = useRef(minute);

  const [careLogData, setCareLogData] = useState(null);

  // ****** DISPLAY DATE ****** //
  function displayDate() {
    const today = new Date();
    const month = today.toLocaleDateString("en-US", { month: "long" });
    const dayNumber = today.getDate();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

    const formattedDate = `${month} ${dayNumber}`;
    const dayNameFormatted = `${dayName}`;

    return [formattedDate, dayNameFormatted];
  }
  const date = displayDate();

  // ****** FETCH CARE LOG DATA ****** //
  async function fetchData() {
    try {
      const careLogUrl = "http://127.0.0.1:8000/dashboard-recommendations/";

      let response = await fetch(careLogUrl);

      const json = response.json();

      setCareLogData(json);
    } catch (error) {
      Alert.alert(
        "Unable to fetch data",
        "Care Log data unavailable, please try again.",
      );
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
}
return (
  <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.topContainer}>
        <View>
          <Text style={[styles.introText, styles.globalFont]}>
            Heyo Bubbs{authCtx.username}!
          </Text>
          <View>
            <Text style={[styles.date, styles.globalFont]}>
              {date[1]}, {date[0]}{" "}
            </Text>
            <Text style={[styles.globalFont, styles.introPhrase]}>
              Whether you fell yesterday, fall today or tomorrow, remember that
              every day is a another opportunity to try again.{"\n"}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, styles.globalFont]}>
            General Insights
          </Text>
          <View style={styles.dashboardCards}>
            <Pressable style={{ width: "48%" }}>
              <DashboardCard
                itemTitle={"This Week"}
                details={"This week you were stable, great progress! "}
                height={154}
                width={"100%"}
                borderColor={Colors.darkBrown}
                fillColor={Colors.lightBrown}
              />
            </Pressable>
            <Pressable style={{ width: "48%" }}>
              <DashboardCard
                itemTitle={"Last Week"}
                details={
                  "You seemed to have a rough week, it seemed that work stress caused some overeating. This is totally okay, just be mindful of the pressure you allow into your life :)"
                }
                height={"auto"}
                width={"100%"}
                borderColor={Colors.darkBlue}
                fillColor={Colors.lightBlue}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, styles.globalFont]}>
            Friendly Suggestions
          </Text>
          <View style={styles.dashboardCards}>
            <Pressable style={{ width: "30%" }}>
              <DashboardCard
                itemTitle={"This Week"}
                details={"This is your status for the week."}
                height={100}
                width={"100%"}
                borderColor={Colors.darkBrown}
                fillColor={Colors.lightBrown}
              />
            </Pressable>
            <Pressable style={{ width: "30%" }}>
              <DashboardCard
                itemTitle={"This Week"}
                details={"This is your status for the week."}
                height={100}
                width={"100%"}
                borderColor={Colors.darkBrown}
                fillColor={Colors.lightBrown}
              />
            </Pressable>
            <Pressable style={{ width: "30%" }}>
              <DashboardCard
                itemTitle={"Last Week"}
                details={"This is your status for last week."}
                height={100}
                width={"100%"}
                borderColor={Colors.darkBlue}
                fillColor={Colors.lightBlue}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.dashboardCard}>
          <Text style={[styles.sectionHeading, styles.globalFont]}>
            Friendly Suggestions
          </Text>
          <Pressable
            style={{ width: "100%" }}
            onPress={() => {
              setActiveModal(!activeModal);
            }}
          >
            <Boxes
              style={[styles.resourcesBox]}
              itemTitle="Resources"
              description="• 3-min grounding • Gentle meal reminder • Journal prompt"
              imgPath={require("../assets/toolbox.png")}
              height={"auto"}
              width={"100%"}
              borderColor={Colors.darkPink}
              fillColor={Colors.lightPink}
            />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightNeutral,
    //backgroundColor: "red",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  topContainer: {
    paddingHorizontal: "5%",
  },
  date: {
    fontSize: 17,
    letterSpacing: 1,
  },
  introPhrase: {
    fontSize: 15,
    letterSpacing: 1,
  },
  globalFont: {
    fontFamily: "Afacad",
    color: Colors.darkNeutral,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: 2,
    paddingBottom: 10,
  },
  dashboardCards: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  introText: {
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
