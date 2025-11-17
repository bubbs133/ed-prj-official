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
import { Ionicons } from "@expo/vector-icons";
import AuthContextProvider from "./auth/auth-context";
import {
  useFonts,
  Afacad_400Regular,
  Afacad_700Bold,
  Afacad_500Medium,
} from "@expo-google-fonts/afacad";
import Colors from "./constants/colors";

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
          headerShown: false,
          tabBarStyle: {
            //bottom: 45,
            //left: 30,
            //right: 30,
            backgroundColor: Colors.lightNeutral,
            borderTopWidth: 2,
            borderWidth: 3,
            borderColor: Colors.darkNeutral,
            //borderRadius: 15,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            height: 70,
            //width: "93%",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color="#000" size={19} />
            ),
          }}
        />
        <Tab.Screen
          name="Journal"
          component={JournalScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" color="#000" size={19} />
            ),
          }}
        />
        <Tab.Screen
          name="Quests"
          component={DailyQuestScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="check" color="#000" size={19} />
            ),
          }}
        />
        <Tab.Screen
          name="Chatbot"
          component={BotIntro}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bubble" color="#000" size={19} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color="#000" size={19} />
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
      </Stack.Navigator>
    );
  }

  {
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
  }

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
