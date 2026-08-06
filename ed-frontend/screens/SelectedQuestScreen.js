import { API_BASE_URL } from "@env";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QUESTS } from "../models/quests";
import { useState, useContext } from "react";
import ImagePicker from "../components/ImagePicker";
import GoBack from "../components/GoBack";
import { AuthContext } from "../auth/auth-context";
import Colors from "../constants/colors";

function SelectedQuestScreen({ route, navigation }) {
  const authCtx = useContext(AuthContext);
  const [questSummary, setQuestSummary] = useState("");
  const [questImages, setQuestImages] = useState([null, null, null, null]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const { questId } = route.params;

  const quest = QUESTS.find((q) => q.id === questId);

  if (!quest) return <Text>Quest not found</Text>;

  async function questSubmitHandler() {
    try {
      const formData = new FormData();

      formData.append("quest_summary", questSummary);

      questImages.forEach((imageUri, index) => {
        if (!imageUri) return;

        formData.append("images", {
          uri: imageUri,
          name: `quest_${index}.jpg`,
          type: "image/jpeg",
        });
      });
      //const url = `${API_BASE_URL}/quest/submit/`;
      const url = `${API_BASE_URL}/quest/submit/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Token ${authCtx.token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.detail || "Quest submit failed");
      }

      setQuestSummary("");
      setQuestImages([null, null, null, null]);
      setModalVisible(true);
    } catch (error) {
      console.log(error);
      setErrorModalVisible(true);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View>
            <GoBack navigation={navigation} />
          </View>
          <View style={styles.mainContentContainer}>
            <Text style={[styles.globalFont, styles.questInfo, {fontWeight: 500, fontSize: 17, paddingBottom: 10}]}>
              {quest.name}
            </Text>
            <Text style={[styles.globalFont, styles.questInfo]}>
              {quest.description}
            </Text>
            <View style={styles.imgsContainer}>
              <View style={styles.imgs}>
                <ImagePicker
                  rotation={[{ rotate: "-5deg" }]}
                  image={questImages[0]}
                  onPickImage={(uri) => {
                    const updated = [...questImages];
                    updated[0] = uri;
                    setQuestImages(updated);
                  }}
                />

                <ImagePicker
                  rotation={[{ rotate: "5deg" }]}
                  image={questImages[1]}
                  onPickImage={(uri) => {
                    const updated = [...questImages];
                    updated[1] = uri;
                    setQuestImages(updated);
                  }}
                />
              </View>

              <View style={styles.imgs}>
                <ImagePicker
                  rotation={[{ rotate: "5deg" }]}
                  image={questImages[2]}
                  onPickImage={(uri) => {
                    const updated = [...questImages];
                    updated[2] = uri;
                    setQuestImages(updated);
                  }}
                />

                <ImagePicker
                  rotation={[{ rotate: "-5deg" }]}
                  image={questImages[3]}
                  onPickImage={(uri) => {
                    const updated = [...questImages];
                    updated[3] = uri;
                    setQuestImages(updated);
                  }}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.globalFont, styles.question]}>
              Any Thoughts?
              </Text>
              <TextInput
                style={[styles.globalFont, styles.textInput]}
                multiline={true}
                placeholder="How did you feel when completing this quest? Take a moment to reflect."
                keyboardType="default"
                onChangeText={(entry) => setQuestSummary(entry)}
              />
            </View>
            <Pressable
              style={styles.submitBtnContainer}
              onPress={questSubmitHandler}
            >
              <Text style={[styles.globalFont, styles.done]}>Done!</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Text style={{ fontSize: 50 }}>✨</Text>
            </View>
            <Text style={[styles.modalTitle, styles.globalFont]}>Awesome</Text>
            <Text style={[styles.modalText, styles.globalFont]}>
              Your quest has been successfully submitted.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.goBack();
              }}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { fontFamily: "Afacad", fontSize: 19, letterSpacing: 0.5 },
                ]}
              >
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Text style={{ fontSize: 50 }}>❌</Text>
            </View>
            <Text style={[styles.modalTitle, styles.globalFont]}>Uh oh!</Text>
            <Text style={[styles.modalText, styles.globalFont]}>
              Quest not submitted, please try again.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setErrorModalVisible(false);
                //navigation.goBack();
              }}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { fontFamily: "Afacad", fontSize: 19, letterSpacing: 0.5 },
                ]}
              >
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

//const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",

    //alignItems: "flex-start",
    //justifyContent: "flex-start",
  },
  globalFont: {
    fontFamily: "Afacad",
    letterSpacing: 1.2,
    color: Colors.darkNeutral
  },
  mainContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    //addingHorizontal: "5%",
  },
  questInfo: {
    textAlign: "center",
    fontSize: 15
  },
  imgsContainer: {
    rowGap: 30,
    paddingTop: 35,
    paddingBottom: 35,
  },
  imgs: {
    flexDirection: "row",
    columnGap: 50,
  },
  inputContainer: {
    //width: "100%",
    width: "90%",
    height: "20%",
    borderRadius: 10,
  },
  question: {
    fontSize: 16,
    paddingLeft: 0,
    paddingTop: 5,
    paddingBottom: 5,
    fontWeight: 500,
  },
  submitBtnContainer: {
    paddingTop: "10%",
  },
  done: {
    fontWeight: 500,
    fontSize: 17,
  },
  textInput: {
    fontSize: 16
  }
});

export default SelectedQuestScreen;
