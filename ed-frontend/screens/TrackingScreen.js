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
import { useEffect, useState, useContext } from "react";
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
import { AuthContext } from "../auth/auth-context";

function TrackingScreen({ navigation }) {
  const [urgeIntensity, setUrgeIntensity] = useState(null);
  const [bingeUrge, setBingeUrge] = useState(null);
  const [restriction, setRestriction] = useState(null);
  const [emotionalDistress, setEmotionalDistress] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(null);
  const [sleepHours, setSleepHours] = useState(null);
  const [numMeals, setNumMeals] = useState(null);
  const [exerciseMins, setExerciseMins] = useState(null);
  const [notes, setNotes] = useState("");

  const authCtx = useContext(AuthContext);

  async function submitHandler() {
    try {
      const url = "http://127.0.0.1:8000/care-log-cluster/";
      let result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authCtx.token}`,
        },
        body: JSON.stringify({
          urge_intensity: Number(urgeIntensity),
          binge_urge: Number(bingeUrge),
          restriction: Number(restriction),
          emotional_distress: Number(emotionalDistress),
          stress_level: Number(stressLevel),
          energy_level: Number(energyLevel),
          sleep_hours: Number(sleepHours),
          num_meals: Number(numMeals),
          exercise_minutes: Number(exerciseMins),
          notes: notes,
        }),
      });
      result = await result.json();
      if (result) {
        //console.log("Entry added", result);
        // clear form fields
        setUrgeIntensity(0);
        setBingeUrge("");
        setRestriction("");
        setEmotionalDistress("");
        setStressLevel("");
        setEnergyLevel("");
        setSleepHours("");
        setNumMeals("");
        setExerciseMins("");
        setNotes("");
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Entry not added", "Please try again");
    } finally {
      //Alert.alert("Entry added!", "Greate job! :D");
      navigation.navigate("Home", result);
    }
  }

  useEffect(() => {
    console.log("TOKEN IN CARE LOG SCREEN:", authCtx.token);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/profilebg.png")}
      style={styles.backgroundImg}
    >
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View>
            <View style={[styles.contentContainer]}>
              <View style={styles.top}>
                <GoBack navigation={navigation} />
                <Text style={[styles.header, styles.globalFont]}>Care Log</Text>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Urge Intensity
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="On a scale from 0 - 10, rate any general urge intensities."
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setUrgeIntensity(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Binge Urge
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="On a scale from 0 - 10, rate any binge urge intensities."
                  onChangeText={(entry) => setBingeUrge(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Restriction Level
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="On a scale from 0 - 10, rate any urges to restrict, either through food or exercise."
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setRestriction(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={styles.section}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Emotional Distress
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="On a scale from 0 to 10, describe any emotional distress—perhaps sadness, anger, etc."
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setEmotionalDistress(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Stress Level
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="On a scale from 0 - 10, rate your stress level."
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setStressLevel(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Energy Level
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="On a scale from 0 - 10, describe the amount of energy you have."
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setEnergyLevel(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Sleep Hours
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="About how many hours did you sleep last night? (Partial hours are welcomed.)"
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setSleepHours(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Number of Meals
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="About how many meals did you have today? (Partial meals are okay too.)"
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setNumMeals(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Exercise in Minutes
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="About how many minutes did you actively engage in physical exercise?"
                  keyboardType="decimal-pad"
                  onChangeText={(entry) => setExerciseMins(entry)}
                  style={[styles.mealEntryBox, styles.globalFont]}
                ></TextInput>
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.sectionNames, styles.globalFont]}>
                  Reflect on your care log
                </Text>
                <TextInput
                  multiline={true}
                  placeholder="What did you learn from your care log today? e.g., when I don't eat enough during the day, I tend to binge in the evening, work stressors always seem to trigger me, etc."
                  onChangeText={(entry) => setNotes(entry)}
                  style={[styles.entryBoxNotes, styles.globalFont]}
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
    marginTop: -5,
  },
  entryBoxNotes: {
    height: 100,
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
