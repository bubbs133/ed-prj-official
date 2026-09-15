import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import {
  SafeAreaViewBase,
  Settings,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DailyQuestScreen from "./screens/DailyQuestScreen";
import { useContext } from "react";
import AssessmentScreen from "./screens/AssessmentScreen";
import LandingScreen from "./screens/LandingScreen";
import JournalScreen from "./screens/JournalScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";

import {
  useFonts,
  Afacad_400Regular,
  Afacad_700Bold,
  Afacad_500Medium,
} from "@expo-google-fonts/afacad";

import Colors from "./constants/colors";
import Chatbot from "./screens/Chatbot";
import AssessmentIntroScreen from "./screens/AssessmentIntroScreen";
import TrackingScreen from "./screens/TrackingScreen";
import ChatroomScreen from "./screens/ChatroomScreen";
import ReadScreen from "./screens/ReadScreen";
import { AuthContext } from "./auth/auth-context";
import AuthContextProvider from "./auth/auth-context";
import ChatListScreen from "./screens/ChatListScreen";
import SelectedQuestScreen from "./screens/SelectedQuestScreen";
import { StackScreen } from "react-native-screens";
import QuickReadsListScreen from "./screens/QuickReadsListScreen";
import GeneralInsightsScreen from "./screens/GeneralInsightsScreen";
import BingeUrgeInsightsScreen from "./screens/BingeUrgeInsightsScreen";
import EmotionalDistressInsightsScreen from "./screens/EmotionalDistressInsightsScreen";
import EnergyInsightsScreen from "./screens/EnergyInsightsScreen";
import ExerciseInsightsScreen from "./screens/ExerciseInsightsScreen";
import MealsInsightsScreen from "./screens/MealsInsightsScreen";
import RestrictionInsightsScreen from "./screens/RestrictionInsightsScreen";
import SleepInsightsScreen from "./screens/SleepInsightsScreen";
import UrgeIntensityInsightsScreen from "./screens/UrgeIntensityInsightsScreen";
import StickerCollectionScreen from "./screens/StickerScreen";
//import MapScreen from "./screens/MapScreen";
import ResourcesScreen from "./screens/ResourcesScreen";
import StressInsightsScreen from "./screens/StressInsightsScreen";
import ToolkitScreen from "./screens/ToolkitScreen";
import BreatheScreen from "./screens/BreatheScreen";
import LearnScreen from "./screens/LearnScreen";
import DecideScreen from "./screens/DecideScreen";
import FoodStudioNavigator from "./screens/FoodStudioNav";
import StudioHomeScreen from "./screens/StudioHomeScreen";
import ExploreScreen from "./screens/ExploreScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const linking = {
  prefixes: [],

  config: {
    screens: {
      // Unauthenticated
      Landing: "/",
      Login: "/login",
      SignUp: "/signup",

      // Authenticated - tab navigator needs a nested config
      TabNav: {
        path: "/app",
        screens: {
          Home: "home",
          "Check-In": "check-in",
          Resources: "resources",
          Profile: "profile",
        },
      },

      // Authenticated - top-level stack screens
      Settings: "/settings",
      Assessment: "/assessment",
      AssessmentIntroScreen: "/assessment-intro",
      Chatbot: "/chatbot",
      Quests: "/quests",
      SelectedQuest: "/quests/:questId",
      ChatbotRoom: "/chatbot-room",
      ChatList: "/chat-list",
      Tracking: "/tracking",
      Journal: "/journal",
      Read: "/read",
      QuickReadsList: "/quick-reads",

      // Insights
      GeneralInsights: "/insights",
      StressScreen: "/insights/stress",
      BingeScreen: "/insights/binge",
      EmotionalDistressScreen: "/insights/emotional-distress",
      EnergyScreen: "/insights/energy",
      ExerciseScreen: "/insights/exercise",
      MealsScreen: "/insights/meals",
      RestrictionScreen: "/insights/restriction",
      SleepScreen: "/insights/sleep",
      UrgeScreen: "/insights/urge-intensity",

      // Toolkit
      Toolkit: "/toolkit",
      Breathe: "/toolkit/breathe",
      Learn: "/toolkit/learn",
      Decide: "/toolkit/decide",

      // Misc
      StickersScreen: "/stickers",
      Explore: "/explore",
      FoodStudioNav: "/food-studio",
      FoodStudioHome: "/food-studio/home",
    },
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Afacad: Afacad_400Regular,
    "Afacad-Medium": Afacad_500Medium,
    "Afacad-Bold": Afacad_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  /*
   * ============================================================
   * UNAUTHENTICATED SCREENS
   * ============================================================
   */

  function UnAuthScreens() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <LoginScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="SignUp">
          {(props) => <SignUpScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  /*
   * ============================================================
   * BOTTOM TAB NAVIGATION
   * ============================================================
   */

  function BottomTabNavigation() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.darkNeutral,
          tabBarInactiveTintColor: Colors.lightGrey,
          safeAreaInsets: { bottom: 0 },

          headerShown: false,

          tabBarStyle: {
            backgroundColor: Colors.homeBlue,
            height: 55,
            bottom: 20,
            borderRadius: 50,
            elevation: 10,
            position: "absolute",
            marginLeft: "20%",
            marginRight: "20%",
            borderTopWidth: 0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={focused ? Colors.focusIcon : Colors.lightGrey}
                size={19}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Check-In"
          component={AssessmentIntroScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Text
                style={{
                  fontSize: 19,
                  color: focused ? Colors.focusIcon : Colors.lightGrey,
                }}
              >
                ༄
              </Text>
            ),

            tabBarStyle: {
              display: "none",
            },
          }}
        />

        <Tab.Screen
          name="Resources"
          component={ResourcesScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Image
                style={{
                  height: 19,
                  width: 19,
                  tintColor: focused ? Colors.focusIcon : Colors.lightGrey,
                }}
                source={require("./assets/icons/floater.png")}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={focused ? Colors.focusIcon : Colors.lightGrey}
                size={19}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  /*
   * ============================================================
   * AUTHENTICATED SCREENS
   * ============================================================
   */

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
              backgroundColor: "white",
            },
          }}
        />

        <Stack.Screen name="Assessment" component={AssessmentScreen} />

        <Stack.Screen
          name="AssessmentIntroScreen"
          component={AssessmentIntroScreen}
        />

        <Stack.Screen name="Chatbot" component={Chatbot} />

        <Stack.Screen name="Quests" component={DailyQuestScreen} />

        <Stack.Screen name="ChatbotRoom" component={ChatroomScreen} />

        <Stack.Screen name="ChatList" component={ChatListScreen} />

        <Stack.Screen name="Tracking" component={TrackingScreen} />

        <Stack.Screen name="Journal" component={JournalScreen} />

        <Stack.Screen name="Read" component={ReadScreen} />

        <Stack.Screen name="SelectedQuest" component={SelectedQuestScreen} />

        <Stack.Screen name="QuickReadsList" component={QuickReadsListScreen} />

        <Stack.Screen
          name="GeneralInsights"
          component={GeneralInsightsScreen}
        />

        <Stack.Screen name="StressScreen" component={StressInsightsScreen} />

        <Stack.Screen name="BingeScreen" component={BingeUrgeInsightsScreen} />

        <Stack.Screen
          name="EmotionalDistressScreen"
          component={EmotionalDistressInsightsScreen}
        />

        <Stack.Screen name="EnergyScreen" component={EnergyInsightsScreen} />

        <Stack.Screen
          name="ExerciseScreen"
          component={ExerciseInsightsScreen}
        />

        <Stack.Screen name="MealsScreen" component={MealsInsightsScreen} />

        <Stack.Screen
          name="RestrictionScreen"
          component={RestrictionInsightsScreen}
        />

        <Stack.Screen name="SleepScreen" component={SleepInsightsScreen} />

        <Stack.Screen
          name="UrgeScreen"
          component={UrgeIntensityInsightsScreen}
        />

        <Stack.Screen
          name="StickersScreen"
          component={StickerCollectionScreen}
        />

        {/* <Stack.Screen name="Map" component={MapScreen} /> */}

        <Stack.Screen name="Resources" component={ResourcesScreen} />

        <Stack.Screen name="Toolkit" component={ToolkitScreen} />

        <Stack.Screen name="Breathe" component={BreatheScreen} />

        <Stack.Screen name="Learn" component={LearnScreen} />

        <Stack.Screen name="Decide" component={DecideScreen} />

        <Stack.Screen name="Explore" component={ExploreScreen} />

        <Stack.Screen name="FoodStudioNav" component={FoodStudioNavigator} />

        <Stack.Screen name="FoodStudioHome" component={StudioHomeScreen} />
      </Stack.Navigator>
    );
  }

  /*
   * ============================================================
   * ROOT NAVIGATOR
   * ============================================================
   */

  function RootNavigator() {
    const authCtx = useContext(AuthContext);

    if (authCtx.isLoading) {
      return null;
    }

    return authCtx.isAuthenticated ? <AuthScreens /> : <UnAuthScreens />;
  }

  /*
   * ============================================================
   * APP
   * ============================================================
   */

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContextProvider>
        <NavigationContainer linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </AuthContextProvider>
    </GestureHandlerRootView>
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
