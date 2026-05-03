import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  WeekCalendar,
  CalendarProvider,
  ExpandableCalendar,
} from "react-native-calendars";
import { getAuth } from "firebase/auth";
import ImagePicker from "../components/ImagePicker";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import DashboardCard from "../components/DashboardCard";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

function ProfileScreen({ navigation }) {
  const [selected, setSelected] = useState(null);

  function settingsHandler() {
    console.log("settings");
    navigation.navigate("Settings");
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.sav}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.top}>
              <View style={styles.userInfoOutterContainer}>
                <Image
                  source={require("../assets/apppfp.jpg")}
                  style={styles.pfppic}
                />
                <View style={styles.userInfoInnerContainer}>
                  <View style={styles.nameSettings}>
                    <Text style={[styles.globalFont, styles.profilename]}>
                      Bubbs{" "}
                    </Text>
                    <View style={styles.bars}>
                      <Pressable onPress={settingsHandler}>
                        <Ionicons name="reorder-three-outline" size={34} />
                      </Pressable>
                    </View>
                  </View>
                  <View style={styles.userStatsContainer}>
                    <View style={styles.stats}>
                      <Text style={styles.globalFont}>10</Text>
                      <Text style={[styles.globalFont, styles.bold]}>
                        entries
                      </Text>
                    </View>
                    <View style={styles.stats}>
                      <Text style={[styles.globalFont]}>6</Text>
                      <Text style={[styles.globalFont, styles.bold]}>
                        sand dollars
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.bioContainer}>
                <Text style={[styles.globalFont, styles.bold]}>Bio</Text>
                <Text style={[styles.globalFont, styles.bio]}>
                  super kewl and fun, ready to learn and grow! :D
                </Text>
              </View>
            </View>
            <View style={styles.calendarContainer}>
              <CalendarProvider date={"2026-04-27"}>
                <ExpandableCalendar
                  initialPosition={"closed"}
                  markedDates={{
                    "2026-04-17": { marked: true, dotColor: "green" },
                    "2026-04-16": { marked: true, dotColor: "orange" },
                  }}
                  theme={{
                    arrowColor: Colors.coffeeBrown,

                    textDayFontFamily: "Afacad",
                    textMonthFontFamily: "Afacad",
                    textDayHeaderFontFamily: "Afacad",
                  }}
                />
              </CalendarProvider>
            </View>
            <View>
              <View>
                <Text>Activity for the day</Text>
              </View>
              <View style={styles.dashboardCards}>
                <Pressable style={{ width: "100%" }}>
                  <DashboardCard
                    itemTitle={null}
                    details={null}
                    height={110}
                    width={"100%"}
                    borderColor={Colors.lightCoffeeBrown}
                    fillColor={Colors.greyish}
                    fontColor={Colors.seaBlue2}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sav: {
    backgroundColor: "#fff",
    flex: 1,
  },
  backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },
  contentContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  userInfoOutterContainer: {
    //alignContent: "center",
    //alignItems: "",
    flexDirection: "row",
  },
  userInfoInnerContainer: {
    flex: 1,
    marginLeft: 22,
  },
  nameSettings: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userStatsContainer: {
    flexDirection: "row",
    gap: 30,
    flex: 1,
  },
  bioContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  bio: {
    marginTop: -5,
  },
  profilename: {
    fontWeight: 500,
    fontSize: 20,
    paddingTop: 10,
  },
  pfppic: {
    resizeMode: "cover",
    //flex: 1,
    borderRadius: 10,
    //borderWidth: 2,
    borderColor: Colors.darkNeutral,
    height: 75,
    width: 75,
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
    color: Colors.darkNeutral,
  },
  bold: {
    fontWeight: 500,
  },
  coolBio: {
    marginBottom: 0,
  },
  calendarContainer: {
    marginTop: 33,
  },
});

export default ProfileScreen;
