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
import GoBack from "../components/GoBack";
import Colors from "../constants/colors";
import { exerciseTypeOptions, behavior } from "../models/exerciseEntryOptions";

function ExerciseTrackingScreen({ navigation }) {
  const [exerciseType, setExerciseType] = useState(null);
  const [duration, setDuration] = useState(null);
  const [moodBefore, setMoodBefore] = useState([]);
  const [moodAfter, setMoodAfter] = useState([]);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  /*const selectEmotionsBefore = (emotion) => {
    if (moodBefore.includes(emotion)) {
      setMoodBefore(moodBefore.filter((e) => e !== emotion));
    } else {
      setMoodBefore([...moodBefore, emotion]);
    }
  };*/

  function submitHandler() {
    console.log("emotion selected");
  }

  return (
    <ImageBackground
      source={require("../assets/profilebg.png")}
      style={styles.backgroundImg}
    >
      <SafeAreaView style={styles.container}>
        <View>
          <View style={[styles.contentContainer]}>
            <GoBack navigation={navigation} />
            <Text style={[styles.header, styles.globalFont]}>
              Active Wellness
            </Text>
            <View style={[styles.section]}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Activity Type
              </Text>
              <View style={[styles.optionsContainer]}>
                {exerciseTypeOptions.map((exercise) => (
                  <Pressable
                    style={[styles.optionsBox]}
                    key={exercise}
                    onPress={() => setExerciseType(exerciseType)}
                  >
                    <Text style={[styles.globalFont]}>{exercise}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Duration
              </Text>
              <TextInput
                multiline={true}
                placeholder="How long was your exercise?"
                onChangeText={(entry) => setDuration(entry)}
                style={[styles.mealEntryBox, styles.globalFont]}
              ></TextInput>
            </View>
            <View style={[styles.section]}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Reason for Activity
              </Text>
              <TextInput
                multiline={true}
                placeholder="Why did you exercise? As punishment, for guilt, or simply for fun?"
                onChangeText={(entry) => setReason(entry)}
                style={[styles.mealEntryBox, styles.globalFont]}
              ></TextInput>
            </View>
            <View style={[styles.section]}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Emotions Before Meal
              </Text>
              <View style={[styles.optionsContainer]}>
                {behavior.map((emotion) => (
                  <Pressable
                    style={[styles.optionsBox]}
                    key={emotion}
                    onPress={() => setMoodBefore(emotion)}
                  >
                    <Text style={[styles.globalFont]}>{emotion}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionNames, styles.globalFont]}>
                Emotions After Meal
              </Text>
              <View style={[styles.optionsContainer]}>
                {behavior.map((emotion) => (
                  <Pressable
                    style={[styles.optionsBox]}
                    key={emotion}
                    onPress={() => setMoodAfter(emotion)}
                  >
                    <Text style={[styles.globalFont]}>{emotion}</Text>
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
  header: {
    fontWeight: 500,
    fontSize: 23,
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
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  optionsBox: {
    borderColor: Colors.darkNeutral,
    borderWidth: 2,
    width: "auto",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 10,
  },
});

export default ExerciseTrackingScreen;
