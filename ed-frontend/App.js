import { StatusBar } from "expo-status-bar";
import { SafeAreaViewBase, StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import BotIntro from "./screens/BotIntro";
import ProfileScreen from "./screens/ProfileScreen";
import DailyQuestScreen from "./screens/DailyQuestScreen";
import { useState } from "react";
import AssessmentScreen from "./screens/AssessmentScreen";
import AssessmentIntroScreen from "./screens/AssessmentIntroScreen";
import LandingScreen from "./screens/LandingScreen";
import JournalScreen from "./screens/JournalScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function onLoginHandler() {
    setIsAuthenticated(true);
  }

  function UnAuthScreens({ onLogin }) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: true }}
        ></Stack.Screen>
        <Stack.Screen name="Login" options={{ headerShown: true }}>
          {(props) => <LoginScreen {...props} onLogin={onLoginHandler} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp">
          {(props) => <SignUpScreen {...props} onLogin={onLoginHandler} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  function BottomTabNavigation() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 45,
            left: 30,
            right: 30,
            elevation: 0,
            backgroundColor: "#ccc",
            borderRadius: 15,
            height: 60,
            ...styles.shadow,
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Journal" component={JournalScreen} />
        <Tab.Screen name="Quests" component={DailyQuestScreen} />
        <Tab.Screen name="Chatbot" component={BotIntro} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="AssessmentIntro" component={AssessmentIntroScreen} />
        <Tab.Screen name="Assessment" component={AssessmentScreen} />
      </Tab.Navigator>
    );
  }

  function AuthScreens() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabNav" component={BottomTabNavigation} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AuthScreens />
      ) : (
        <UnAuthScreens onLogin={onLoginHandler} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    shadowColor: "#cc32ds",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
