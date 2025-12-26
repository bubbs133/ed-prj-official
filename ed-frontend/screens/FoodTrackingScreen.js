import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SecondButton from "../components/SecondButton";
import MainButton from "../components/MainButton";
import Colors from "../constants/colors";
import {
  HUNGER_LEVELS,
  MEAL_TYPES,
  EMOTIONS,
} from "../models/mealEntryOptions";
import GoBack from "../components/GoBack";

function FoodTrackingScreen({ navigation }) {
  const [mealType, setMealType] = useState(null);
  const [moodBefore, setMoodBefore] = useState([]);
  const [moodAfter, setMoodAfter] = useState([]);
  const [mealEntry, setMealEntry] = useState("");
  const [hungerLevel, setHungerLevel] = useState(null);
  const [notes, setNotes] = useState("");

  async function submitHandler() {
    console.log("workss");
    try {
      const url = "http://127.0.0.1:8000/meal/";
      //const url = "http://92.168.0.125/journal";
      let result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealEntry: mealEntry,
          mealType: mealType,
          moodBefore: moodBefore,
          moodAfter: moodAfter,
          hungerLevel: hungerLevel,
          notes: notes,
        }),
      });
      result = await result.json();
      if (result) {
        console.log("Meal entry added", result);
        setEntry("");
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Meal entry not added", "Please try again");
    }
  }

  return (
    <ImageBackground
      source={require("../assets/profilebg.png")}
      style={styles.backgroundImg}
    >
      <SafeAreaView style={styles.container}>
        <View>
          <View style={[styles.contentContainer]}>
            <View style={styles.top}>
              <GoBack navigation={navigation} />
              <Text style={[styles.header, styles.globalFont]}>
                Mindful Meals
              </Text>
            </View>
            <View style={[styles.section]}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Meal Type
              </Text>
              <View style={[styles.optionsContainer]}>
                {MEAL_TYPES.map((mealType) => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionsBox,
                      pressed
                        ? styles.optionsBoxPressed
                        : styles.optionsBoxUnpressed,
                    ]}
                    key={mealType}
                    onPress={() => setMealType(mealType)}
                  >
                    {({ pressed }) => (
                      <Text
                        style={[
                          styles.globalFont,
                          pressed ? styles.textPressed : styles.textUnpressed,
                        ]}
                      >
                        {mealType}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={[styles.section]}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Brief Description
              </Text>
              <TextInput
                multiline={true}
                placeholder="Don't overthink it, just a brief description of your meal :)"
                onChangeText={(entry) => setMealEntry(entry)}
                style={[styles.mealEntryBox, styles.globalFont]}
              ></TextInput>
            </View>
            <View style={[styles.section]}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Emotions Before Meal
              </Text>
              <View style={[styles.optionsContainer]}>
                {EMOTIONS.map((emotion) => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionsBox,
                      pressed
                        ? styles.optionsBoxPressed
                        : styles.optionsBoxUnpressed,
                    ]}
                    key={emotion}
                    onPress={() => setMoodBefore(emotion)}
                  >
                    {({ pressed }) => (
                      <Text
                        style={[
                          styles.globalFont,
                          pressed ? styles.textPressed : styles.textUnpressed,
                        ]}
                      >
                        {emotion}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Emotions After Meal
              </Text>
              <View style={[styles.optionsContainer]}>
                {EMOTIONS.map((emotion) => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionsBox,
                      pressed
                        ? styles.optionsBoxPressed
                        : styles.optionsBoxUnpressed,
                    ]}
                    key={emotion}
                    onPress={() => setMoodAfter(emotion)}
                  >
                    {({ pressed }) => (
                      <Text
                        style={[
                          styles.globalFont,
                          pressed ? styles.textPressed : styles.textUnpressed,
                        ]}
                      >
                        {emotion}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Hunger Level
              </Text>
              <View style={[styles.optionsContainer]}>
                {HUNGER_LEVELS.map((level) => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionsBox,
                      pressed
                        ? styles.optionsBoxPressed
                        : styles.optionsBoxUnpressed,
                    ]}
                    key={level}
                    onPress={() => setHungerLevel(level)}
                  >
                    {({ pressed }) => (
                      <Text
                        style={[
                          styles.globalFont,
                          pressed ? styles.textPressed : styles.textUnpressed,
                        ]}
                      >
                        {level}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={[styles.section]}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Notes
              </Text>
              <TextInput
                multiline={true}
                placeholder="Any thoughts?"
                onChangeText={(entry) => setNotes(entry)}
                style={[styles.mealEntryBox, styles.globalFont]}
              ></TextInput>
            </View>
            <MainButton
              style={styles.submitbtn}
              buttonTitle={"Submit"}
              handler={submitHandler}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default FoodTrackingScreen;

const styles = StyleSheet.create({
  backgroundImg: {
    resizeMode: "cover",
    flex: 1,
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  contentContainer: {
    paddingHorizontal: "5%",
  },
  top: {
    flexDirection: "row",
  },
  header: {
    fontWeight: 500,
    fontSize: 23,
    marginTop: 9,
    textAlign: "center",
    flex: 1,
  },
  sectionNames: {
    fontSize: 17,
    fontWeight: 500,
    marginBottom: 5,
  },
  section: {
    marginTop: 7,
    marginBottom: 7,
  },
  mealEntryBox: {
    height: 60,
    /*borderColor: Colors.darkNeutral,
    borderRadius: 10,
    borderWidth: 2*/
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  optionsBox: {
    borderWidth: 2,
    width: "auto",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 10,
  },
  optionsBoxUnpressed: {
    borderColor: Colors.darkNeutral,
  },
  optionsBoxPressed: {
    borderColor: "#77605A",
    backgroundColor: "#77605A",
  },
  textPressed: {
    color: Colors.lightNeutral,
  },
  textUnpressed: {
    color: Colors.darkNeutral,
  },
});
