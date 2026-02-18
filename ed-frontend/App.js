import { StatusBar } from "expo-status-bar";
import {
  SafeAreaViewBase,
  Settings,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
import SettingsScreen from "./screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import AuthContextProvider from "./auth/auth-context";
import {
  useFonts,
  Afacad_400Regular,
  Afacad_700Bold,
  Afacad_500Medium,
} from "@expo-google-fonts/afacad";
import Colors from "./constants/colors";
import Chatbot from "./screens/Chatbot";
import FoodTrackingScreen from "./screens/FoodTrackingScreen";
import ExerciseTrackingScreen from "./screens/ExerciseTrackingScreen";
import TrackingScreen from "./screens/TrackingScreen";
import ChatroomScreen from "./screens/ChatroomScreen";
import SandboxScreen from "./screens/SandboxScreen";
import ReadScreen from "./screens/ReadScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function onLoginHandler() {
    setIsAuthenticated(true);
  }

  const [fontsLoaded] = useFonts({
    Afacad: Afacad_400Regular,
    "Afacad-Medium": Afacad_500Medium,
    "Afacad-Bold": Afacad_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  function UnAuthScreens({ onLogin }) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen name="Login" options={{ headerShown: false }}>
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
          tabBarActiveTintColor: Colors.darkNeutral,
          tabBarInactiveTintColor: Colors.lightGrey,
          safeAreaInsets: { bottom: 0 },
          //tabBarActiveBackgroundColor: Colors.darkPink,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 2,
            borderWidth: 3,
            borderColor: Colors.darkNeutral,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color="#42190D" size={19} />
            ),
          }}
        />
        <Tab.Screen
          name="Sandbox"
          component={SandboxScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="leaf-outline" color="#42190D" size={19} />
            ),
          }}
        />
        <Tab.Screen
          name="Chatbot"
          component={BotIntro}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" color="#42190D" size={19} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color="#42190D" size={19} />
            ),
          }}
        />
        {/* <Tab.Screen name="AssessmentIntro" component={AssessmentIntroScreen} /> */}
        {/* <Tab.Screen name="Assessment" component={AssessmentScreen} /> */}
      </Tab.Navigator>
    );
  }

  function AuthScreens() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabNav" component={BottomTabNavigation} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            title: "",
            headerStyle: {
              backgroundColor: Colors.lightNeutral,
            },
          }}
        />
        <Stack.Screen name="Assessment" component={AssessmentScreen} />
        <Stack.Screen name="Chatbot" component={Chatbot} />
        <Stack.Screen name="Quests" component={DailyQuestScreen} />
        <Stack.Screen name="ChatbotRoom" component={ChatroomScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="Read" component={ReadScreen}/>
        {/*
        <Stack.Screen name="Meals" component={FoodTrackingScreen} />
        <Stack.Screen name="Exercises" component={ExerciseTrackingScreen} />
        */}
      </Stack.Navigator>
    );
  }

  /*return (
    <AuthContextProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          <AuthScreens />
        ) : (
          <UnAuthScreens onLogin={onLoginHandler} />
        )}
      </NavigationContainer>
    </AuthContextProvider>
  );*/

  return (
    <NavigationContainer>
      <AuthScreens />
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
});
