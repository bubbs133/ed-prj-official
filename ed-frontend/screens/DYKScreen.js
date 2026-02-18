import { StyleSheet, Text, View } from "react-native";

function DYKScreen() {
  const [rndFoodFact, setRndFoodFact] = useState(null);

  function generateRandomIndex() {
    const rndNum = Math.floor(Math.random() * foodFacts.length);
    return rndNum;
  }

  function generateRndFact(rndNum) {
    setRndFoodFact(foodFacts[rndNum]);
  }

  function timeChangeCheck() {
    const today = new Date().getMinutes();

    if (today !== prevMin.current) {
      prevMin.current == today;
      setMinute(today);
      //console.log("min updated");
    }
    //console.log("time checked");
  }

  useEffect(() => {
    const rndNum = generateRandomIndex();
    generateRndFact(rndNum);

    const interval = setInterval(() => {
      timeChangeCheck();
    }, 50000);

    return () => clearInterval(interval);
  }, [minute]);
  return (
    <View>
      {/*<View style={styles.factContainer}>
          <Text>{result ? `Result: ${result}` : "No result"}</Text>
            <View style={styles.factText}>
              <Text style={[styles.duk, styles.globalFont]}>
                Did you know...
              </Text>
              <Text style={styles.fact} numberOfLines={4} ellipsizeMode="tail">
                {rndFoodFact ? rndFoodFact.fact : "fact blank"}
              </Text>
            </View>
          </View>*/}
    </View>
  );
}

const styles = StyleSheet.create({});

export default DYKScreen;
