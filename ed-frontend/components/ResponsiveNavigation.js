import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { useNavigation, useNavigationState } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/colors";

const NAV_ITEMS = [
  {
    name: "Home",
    route: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    name: "Check-In",
    route: "Assessment",
    icon: "create-outline",
    activeIcon: "create",
  },
  {
    name: "Resources",
    route: "Resources",
    icon: "book-outline",
    activeIcon: "book",
  },
  {
    name: "Profile",
    route: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
];

export default function ResponsiveNavigation() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const isDesktop = width >= 900;

  const currentRoute = useNavigationState((state) => {
    if (!state || !state.routes) return null;

    const route = state.routes[state.index];

    return route?.name;
  });

  const navigateTo = (route) => {
    navigation.navigate(route);
  };

  // --------------------------------------------------
  // DESKTOP SIDEBAR
  // --------------------------------------------------

  if (isDesktop) {
    return (
      <View style={styles.sidebar}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>UMI</Text>
        </View>

        {/* Main navigation */}
        <View style={styles.navItems}>
          {NAV_ITEMS.map((item) => {
            const active = currentRoute === item.route;

            return (
              <Pressable
                key={item.route}
                onPress={() => navigateTo(item.route)}
                style={({ hovered }) => [
                  styles.navItem,

                  active && styles.navItemActive,

                  hovered && !active && styles.navItemHovered,
                ]}
              >
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={20}
                  color={active ? Colors.darkBlueText : Colors.lightGrey}
                  style={styles.navIcon}
                />

                <Text
                  style={[styles.navLabel, active && styles.navLabelActive]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <Pressable
            onPress={() => navigateTo("Settings")}
            style={({ hovered }) => [
              styles.navItem,

              hovered && styles.navItemHovered,
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={Colors.greyish}
              style={styles.navIcon}
            />

            <Text style={styles.navLabel}>Settings</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // --------------------------------------------------
  // MOBILE BOTTOM NAVIGATION
  // --------------------------------------------------

  return (
    <View style={styles.mobileBar}>
      {NAV_ITEMS.map((item) => {
        const active = currentRoute === item.route;

        return (
          <Pressable
            key={item.route}
            onPress={() => navigateTo(item.route)}
            style={styles.mobileItem}
          >
            <Ionicons
              name={active ? item.activeIcon : item.icon}
              size={20}
              color={active ? Colors.darkBlueText : Colors.lightGrey}
            />

            <Text
              style={[styles.mobileLabel, active && styles.mobileLabelActive]}
            >
              {item.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // ==================================================
  // DESKTOP SIDEBAR
  // ==================================================

  sidebar: {
    position: "absolute",

    left: 0,
    top: 0,
    bottom: 0,

    width: 220,

    backgroundColor: "#FFFFFF",

    paddingHorizontal: 18,
    paddingTop: 35,
    paddingBottom: 25,

    borderRightWidth: 1,
    borderRightColor: "#EEEEEE",

    zIndex: 1000,
  },

  logoContainer: {
    paddingHorizontal: 14,
    marginBottom: 45,
  },

  logo: {
    fontSize: 26,
    fontWeight: "700",

    letterSpacing: 3,

    color: Colors.darkNeutral,
  },

  navItems: {
    gap: 6,
  },

  navItem: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 12,
    paddingHorizontal: 14,

    borderRadius: 12,
  },

  navItemActive: {
    backgroundColor: Colors.homeBlue,
  },

  navItemHovered: {
    backgroundColor: "#F7F7F7",
  },

  navIcon: {
    width: 28,
  },

  navLabel: {
    fontSize: 15,

    color: Colors.greyish,

    fontFamily: "Afacad",
  },

  navLabelActive: {
    color: Colors.darkNeutral,
    fontFamily: "Afacad-Bold",
  },

  bottomSection: {
    marginTop: "auto",
  },

  // ==================================================
  // MOBILE NAVIGATION
  // ==================================================

  mobileBar: {
    position: "absolute",

    bottom: 20,

    left: 20,
    right: 20,

    height: 62,

    backgroundColor: Colors.homeBlue,

    borderRadius: 32,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    elevation: 10,

    zIndex: 1000,
  },

  mobileItem: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    height: "100%",
  },

  mobileLabel: {
    marginTop: 2,

    fontSize: 10,

    color: Colors.greyish,

    fontFamily: "Afacad",
  },

  mobileLabelActive: {
    color: Colors.darkNeutral,

    fontFamily: "Afacad-Bold",
  },
});
