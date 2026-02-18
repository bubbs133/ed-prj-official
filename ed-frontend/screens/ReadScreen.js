import { SafeAreaView } from "react-native-safe-area-context";
import { QUICK_READS } from "../models/reads";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import GoBack from "../components/GoBack";

export default function ReadScreen({ route, navigation }) {
  const { readId } = route.params;

  const read = QUICK_READS.find((r) => r.id === readId);

  if (!read) return <Text>Read not found</Text>;

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View>
            <GoBack navigation={navigation} />
          </View>
          <Text style={[styles.globalFont, styles.title]}>
            {read.title} {"\n"}
          </Text>
          <Text style={[styles.globalFont, styles.intro]}>
            {read.intro} {"\n"}
          </Text>
          <Text style={[styles.globalFont, styles.paragraph]}>
            {read.paragraphOne} {"\n"}
          </Text>
          <Text style={[styles.globalFont, styles.paragraph]}>
            {read.paragraphTwo} {"\n"}
          </Text>
          <Text style={[styles.globalFont, styles.paragraph]}>
            {read.paragraphThree} {"\n"}
          </Text>
          <Text style={[styles.globalFont, styles.paragraph]}>
            {read.paragraphFour} {"\n"}
          </Text>
          <Text style={[styles.globalFont, styles.paragraph]}>
            {read.paragraphFive} {"\n"}
          </Text>
          <View>
            <Text style={[styles.globalFont, styles.citation]}>
              {read.citation}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1,
  },
  contentContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
  intro: {
    fontSize: 16,
  },
  paragraph: {
    fontSize: 16,
  },
});
