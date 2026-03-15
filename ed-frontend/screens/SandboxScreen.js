import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { useState, useEffect, useRef, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import { RESOURCES } from "../models/resources";
import { DAILY_ACTIVITIES, CHECK_INS } from "../models/activityBoxes";
import Boxes from "../components/Boxes";
import { QUICK_READS } from "../models/reads";
import DashboardCard from "../components/DashboardCard";

function SandboxSreen({ navigation }) {
  const [activeModal, setActiveModal] = useState(false);

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
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.top}>
            <Text style={[styles.heading, styles.globalFont]}>
              Wellness Sandbox
            </Text>
            <Text style={[styles.screenInfo, styles.globalFont]}>
              Jump into the sandbox, discover new information about
              yourself, eating disorders, nutrition, and who knows, maybe even
              make some sandcastles.
            </Text>
          </View>
          <View style={styles.activityBoxes}>
            <View style={styles.activitySection}>
              <Text style={[styles.sectionHeading, styles.globalFont]}>
                Official Resources
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
                  description="Check out this list of official resources—help is closer than you think!"
                  imgPath={require("../assets/toolbox.png")}
                  height={130}
                  width={"100%"}
                  borderColor={Colors.darkBrown}
                  fillColor={Colors.lightBrown}
                />
              </Pressable>
            </View>
            <View style={styles.activitySection}>
              <Text style={[styles.sectionHeading, styles.globalFont]}>
                Daily Activities
              </Text>
              <FlatList
                scrollEnabled={false}
                data={DAILY_ACTIVITIES}
                numColumns={2}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
                renderItem={({ item }) => (
                  <Pressable
                    style={{ width: "48%" }}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <Boxes
                      itemTitle={item.title}
                      description={item.description}
                      imgPath={item.img}
                      height={154}
                      width={"100%"}
                      borderColor={item.border}
                      fillColor={item.color}
                    />
                  </Pressable>
                )}
              />
            </View>
            <View style={styles.activitySection}>
              <Text style={[styles.sectionHeading, styles.globalFont]}>
                Check-In
              </Text>
              <FlatList
                scrollEnabled={false}
                data={CHECK_INS}
                numColumns={2}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
                renderItem={({ item }) => (
                  <Pressable
                    style={{ width: "48%" }}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <Boxes
                      itemTitle={item.title}
                      description={item.description}
                      imgPath={item.img}
                      height={154}
                      width={"100%"}
                      borderColor={item.border}
                      fillColor={item.color}
                    />
                  </Pressable>
                )}
              />
            </View>
            <View style={styles.activitySection}>
              <Text style={[styles.sectionHeading, styles.globalFont]}>
                Quick Reads
              </Text>
              <FlatList
                scrollEnabled={false}
                data={QUICK_READS}
                numColumns={1}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    style={{ width: "100%" }}
                    onPress={() =>
                      navigation.navigate("Read", { readId: item.id })
                    }
                  >
                    <DashboardCard
                      itemTitle={item.title}
                      details={item.cardSummary}
                      height={120}
                      width={"100%"}
                      borderColor={item.border}
                      fillColor={item.color}
                    />
                  </Pressable>
                )}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SandboxSreen;

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  contentContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  heading: {
    fontSize: 23,
    justifyContent: "flex-start",
    fontWeight: 500,
    letterSpacing: 1,
  },
  screenInfo: {
    marginBottom: 25,
    fontSize: 15,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: 2,
    paddingBottom: 10,
  },
});
