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

function TrackingScreen({ navigation }) {
  const [mealDescription, setMealDescription] = useState("");
  const [mood, setMood] = useState(null);
  const [numMeals, setNumMeals] = useState(null);
  const [satiation, setSatiation] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [notes, setNotes] = useState("");

  async function submitHandler() {
    try {
      const url = "http://127.0.0.1:8000/tracking/";
      //const url = "http://92.168.0.125/journal";
      let result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_meals: numMeals,
          meal_description: mealDescription,
          avg_mood: mood,
          satiation_level: satiation,
          exercise_amount_hr: exercise,
          post_meal_notes: notes,
        }),
      });
      result = await result.json();
      if (result) {
        console.log("Meal entry added", result);
        // clear form fields
        setMealDescription("");
        setMood("");
        setNumMeals("");
        setSatiation("");
        setExercise("");
        setNotes("");
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
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View>
            <View style={[styles.contentContainer]}>
              <View style={styles.top}>
                <GoBack navigation={navigation} />
                <Text style={[styles.header, styles.globalFont]}>
                  Mindful Tracking
                </Text>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Number of Meals
                </Text>
                <TextInput
                  multiline={false}
                  placeholder="How many meals did you have today? :)"
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setNumMeals(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Brief Description of Meals
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="Don't overthink it, just a brief description of your meal :)"
                  onChangeText={(entry) => setMealDescription(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Average Mood Today
                </Text>
                <TextInput
                  multiline={false}
                  placeholder="How did you feel before your meals?"
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setMood(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={styles.section}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Satiation Level
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="On a scale from 0 to 10 (lowest to highest), ow satisfied were you after your meals?"
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setSatiation(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Exercise Amount
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="How many hours of active exercise did you complete today?"
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setExercise(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Notes
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="Any final thoughts?"
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
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default TrackingScreen;

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
    marginTop: 1,
    marginBottom: 1,
  },
  mealEntryBox: {
    height: 60,
    /*borderColor: Colors.darkNeutral,
    borderRadius: 10,
    borderWidth: 2*/
    marginTop: -5
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
