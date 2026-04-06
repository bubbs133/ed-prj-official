import { StyleSheet, Text, View } from "react-native";
import { CARELOG_QUESTIONS } from "../models/carelogQuestions";

function CarelogScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = CARELOG_QUESTIONS[currentIndex];

  function handleNext() {
    if (currentIndex < sections.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // optional: go back or show "done"
      navigation.goBack();
    }
  }

  return (
    <View>
      <Text>CarelogScreen</Text>
      <View>
        <Text style={styles.progress}>
          {currentIndex + 1} / {sections.length}
        </Text>
      </View>
      <Pressable onPress={handleNext} style={{ flex: 1 }}>
        <View style={styles.questContainer}>
          <View style={styles.questCard}>
            <Text style={styles.questName}>{currentSection.subtitle}</Text>

            <Text style={styles.questText}>{currentSection.paragraph}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});

export default CarelogScreen;
