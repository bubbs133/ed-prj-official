import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import ChatBox from "../components/ChatBox";
import GoBack from "../components/GoBack";

function ChatListScreen({ navigation }) {
  const CHAT_MSJS = [
    {
      id: "0",
      name: "Test",
      preview: "This is another preview message :)",
      //img: require("../assets/foodgreen.png"),
      //screen: "Tracking",
    },
    {
      id: "1",
      name: "Test 2",
      preview: "This is another preview message :)",
      //img: require("../assets/foodgreen.png"),
      //screen: "Tracking",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <GoBack navigation={navigation} />
          <FlatList
            scrollEnabled={false}
            data={CHAT_MSJS}
            //numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={{ width: "95%" }}
                //onPress={() => navigation.navigate(item.screen)}
              >
                <ChatBox
                  name={item.name}
                  preview={item.preview}
                  height={100}
                  width={"100%"}
                />
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default ChatListScreen;
