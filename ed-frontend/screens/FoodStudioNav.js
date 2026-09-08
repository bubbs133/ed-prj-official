// FoodStudioNavigator.js
// Requires: npm install @react-navigation/native @react-navigation/native-stack
// Nest <FoodStudioNavigator /> inside your app's existing NavigationContainer
// (don't add a second NavigationContainer if one already wraps your app),
// e.g. as a screen reachable from your main tab bar.

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors, fonts } from "../constants/theme";

//import HomeScreen from "../screens/HomeScreen";
//import CreateScreen from "../screens/CreateScreen";
import ExploreScreen from "./ExploreScreen";
import LearnScreen from "./LearnScreen";
//import RecipesScreen from "../screens/RecipesScreen";
import DecideScreen from "./DecideScreen";
import StudioHomeScreen from "./StudioHomeScreen";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerShadowVisible: false,
  headerTintColor: colors.ink,
  headerTitleStyle: { fontFamily: fonts.display, fontSize: 17 },
  contentStyle: { backgroundColor: colors.bg },
};

export default function FoodStudioNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="FoodStudioHome"
        component={StudioHomeScreen}
        options={{ title: "Food Studio", headerShown: false }}
      />
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ title: "Explore" }}
      />
      {/*<Stack.Screen
        name="Learn"
        component={LearnScreen}
        options={{ title: "Learn" }}
      />*/}
      <Stack.Screen
        name="Decide"
        component={DecideScreen}
        options={{ title: "I Don't Know What to Eat" }}
      />
    </Stack.Navigator>
  );
}
