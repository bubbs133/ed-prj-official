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
import MapScreen from "./screens/MapScreen";
import ResourcesScreen from "./screens/ResourcesScreen";
import StressInsightsScreen from "./screens/StressInsightsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  //const [isAuthenticated, setIsAuthenticated] = useState(false);

  /*function onLoginHandler() {
    setIsAuthenticated(true);
  }*/

  //const authCtx = useContext(AuthContext);

  const [fontsLoaded] = useFonts({
    Afacad: Afacad_400Regular,
    "Afacad-Medium": Afacad_500Medium,
    "Afacad-Bold": Afacad_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  function UnAuthScreens() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <LoginScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp">
          {(props) => <SignUpScreen {...props} />}
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
            //backgroundColor: "transparent",
            //borderTopWidth: 2,
            //borderWidth: 3,
            //borderColor: Colors.darkNeutral,
            //borderTopLeftRadius: 25,
            //borderTopRightRadius: 25,
            backgroundColor: Colors.greyish,
            //backgroundColor: "#fff",
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
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={focused ? Colors.darkNeutral : Colors.lightGrey}
                size={19}
              />
            ),
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
                  tintColor: focused ? Colors.darkNeutral : Colors.lightGrey,
                }}
                source={require("./assets/icons/floater.png")}
              />
            ),
          }}
        />
        {/*<Tab.Screen
          name="Chatbot"
          component={BotIntro}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" color="#42190D" size={19} />
            ),
          }}
        />*/}
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={focused ? Colors.darkNeutral : Colors.lightGrey}
                size={19}
              />
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
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen name="Assessment" component={AssessmentScreen} />
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
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Resources" component={ResourcesScreen} />
      </Stack.Navigator>
    );
  }

  function RootNavigator() {
    const authCtx = useContext(AuthContext);

    return authCtx.isAuthenticated ? <AuthScreens /> : <UnAuthScreens />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContextProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthContextProvider>
    </GestureHandlerRootView>
  );

  /*return (
    <NavigationContainer>
      <UnAuthScreens />
    </NavigationContainer>
  );*/
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
