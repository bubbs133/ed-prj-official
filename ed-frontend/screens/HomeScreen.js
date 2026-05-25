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

  const [careLogData, setCareLogData] = useState(0);

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
      //const careLogUrl = "http://192.168.0.125:8000/dashboard-recommendations/";

      let response = await fetch(careLogUrl, {
        headers: {
          Authorization: `Token ${authCtx.token}`,
        },
      });

      const json = await response.json();

      setCareLogData(json);
    } catch (error) {
      Alert.alert(
        "Unable to fetch data",
        "Data unavailable, please try again.",
      );
    }
  }

  useEffect(() => {
    console.log("TOKEN IN HOME SCREEN:", authCtx.token);
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <View>
            <Text style={[styles.introText, styles.globalFont]}>
              Hi Bubbs{authCtx.username}!
            </Text>
            <View>
              <Text style={[styles.date, styles.globalFont]}>
                {date[1]}, {date[0]}{" "}
              </Text>
              <Text style={[styles.globalFont, styles.introPhrase]}>
                Whether you fell yesterday, fall today or tomorrow, remember
                that every day is a another opportunity to try again.{"\n"}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, styles.globalFont]}>
              Quick Actions
            </Text>
            <View style={styles.qaContainer}>
              <Pressable
                style={[styles.qaBox]}
                onPress={() => navigation.navigate("Assessment")}
              >
                <Image
                  style={styles.qaIcon}
                  source={require("../assets/icons/wave-brown.png")}
                />
                <Text style={[styles.globalFont, styles.qaText]}>Check in</Text>
              </Pressable>
              <Pressable
                style={[styles.qaBox]}
                onPress={() => navigation.navigate("Map")}
              >
                <Image
                  style={styles.qaIcon}
                  source={require("../assets/icons/map-brown.png")}
                />
                <Text style={[styles.globalFont, styles.qaText]}>
                  Help Near Me
                </Text>
              </Pressable>
              <Pressable
                style={[styles.qaBox]}
                onPress={() => navigation.navigate("QuickReadsList")}
              >
                <Image
                  style={styles.qaIcon}
                  source={require("../assets/icons/brown-umbrella.png")}
                />
                <Text style={[styles.globalFont, styles.qaText]}>
                  Quick Reads
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, styles.globalFont]}>
              General Insights
            </Text>
            <View style={styles.dashboardCards}>
              <Pressable
                style={{ width: "100%" }}
                onPress={() => navigation.navigate("GeneralInsights")}
              >
                <DashboardCard
                  itemTitle="Your Weekly Progress"
                  details={null}
                  height={200}
                  width={"100%"}
                  borderColor={Colors.lightCoffeeBrown}
                  fillColor={Colors.seaBlue2}
                  fontColor={Colors.seaDarkBlue}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, styles.globalFont]}>
              Your Journey
            </Text>
            <View style={styles.dashboardCards}>
              <Pressable
                style={{ width: "50%", paddingRight: 7 }}
                onPress={() => navigation.navigate("StickersScreen")}
              >
                <Boxes
                  style={[styles.resourcesBox]}
                  itemTitle="Sticker Shop"
                  description="Redeem your sand dollars!"
                  imgPath={require("../assets/icons/seastar.png")}
                  height={130}
                  width={"100%"}
                  borderColor={Colors.coffeeBrown}
                  fillColor={Colors.seaDarkBlue}
                  fontColor={Colors.seaBlue2}
                />
              </Pressable>
              <Pressable
                style={{ width: "50%", paddingLeft: 7 }}
                onPress={() => navigation.navigate("Profile")}
              >
                <Boxes
                  style={[styles.resourcesBox]}
                  itemTitle="My Profile"
                  description="Let's take a look at my history."
                  imgPath={require("../assets/icons/floater.png")}
                  height={130}
                  width={"100%"}
                  borderColor={Colors.coffeeBrown}
                  fillColor={Colors.seaDarkBlue}
                  fontColor={Colors.seaBlue2}
                />
              </Pressable>
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
    backgroundColor: "white",
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
    paddingBottom: 7,
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
  section: {
    paddingBottom: 15,
  },
  headings: {
    fontWeight: 700,
    letterSpacing: 2,
    paddingBottom: 10,
    fontSize: 17,
    marginLeft: "5%",
  },
  scrollContent: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 20,
  },
  scrollItemPress: {
    flexDirection: "row",
    height: 170,
    width: 200,
    //gap: 100,
    //marginLeft: "5%",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.darkNeutral,
    opacity: 50,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  topCards: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    //paddingHorizontal: 10,
  },
  qaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  qaBox: {
    flex: 1,
    height: 90,
    backgroundColor: Colors.lightCoffeeBrown,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: -5,
  },

  qaText: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
    color: Colors.cream,
    textAlign: "center",
    marginTop: 15,
  },

  qaIcon: {
    width: 35,
    height: 35,
  },
});

export default HomeScreen;
