import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import React from "react";
import GoBack from "../components/GoBack";
import Colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

function ResourcesScreen({ navigation }) {
  const resources = [
    {
      title: "988 Suicide & Crisis Lifeline",
      description: "24/7 emotional support for people in distress or crisis.",
      website: "https://988lifeline.org",
      call: "988",
      text: "988",
    },
    {
      title: "National Alliance for Eating Disorders",
      description:
        "Free support groups, referrals, and education, led by certified therapists.",
      website: "https://www.allianceforeatingdisorders.com",
      call: "8666621235",
    },
    {
      title: "NEDA",
      description:
        "Education, recovery resources, screenings, and treatment support.",
      website: "https://www.nationaleatingdisorders.org",
    },
    {
      title: "Crisis Text Line",
      description: "Text with a trained volunteer crisis counselor 24/7.",
      website: "https://www.crisistextline.org",
      text: "741741",
    },
  ];

  async function openLink(url) {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Unavailable",
          "This action isn't supported on your device.",
        );
      }
    } catch (error) {
      console.log("Linking error:", error);
      Alert.alert("Unavailable", "Couldn't open this link.");
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.paddingContainer}>
          <View>
            <View style={styles.top}>
              <Text style={[styles.heading, styles.globalFont]}>Resources</Text>

              <Text style={[styles.screenInfo, styles.globalFont]}>
                Connect with professionals around you who will give you proper
                support and guidence, help is closer than you think!
              </Text>
            </View>
          </View>

          <View style={styles.mapButton}>
            <Text
              style={[
                styles.buttonText,
                styles.globalFont,
                { marginBottom: 8 },
              ]}
            >
              Find Local Help Centers
            </Text>
            <Text style={[styles.resourceDescription, styles.globalFont]}>
              Find profressional help near your area and connect with them
              today.
            </Text>
            <TouchableOpacity
              style={styles.actionButtonMap}
              onPress={() => navigation.navigate("Map")}
            >
              <Ionicons
                name="map-outline"
                size={18}
                color={Colors.darkNeutral}
              />
              <Text style={[styles.actionText, styles.globalFont]}>Map</Text>
            </TouchableOpacity>
          </View>

          {resources.map((resource, index) => (
            <View key={index} style={styles.resourceCard}>
              <Text style={[styles.resourceTitle, styles.globalFont]}>
                {resource.title}
              </Text>

              <Text style={[styles.resourceDescription, styles.globalFont]}>
                {resource.description}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openLink(resource.website)}
                >
                  <Ionicons
                    name="globe-outline"
                    size={18}
                    color={Colors.darkNeutral}
                  />
                  <Text style={[styles.actionText, styles.globalFont]}>
                    Website
                  </Text>
                </TouchableOpacity>

                {resource.call && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openLink(`tel:${resource.call}`)}
                  >
                    <Ionicons
                      name="call-outline"
                      size={18}
                      color={Colors.darkNeutral}
                    />
                    <Text style={[styles.actionText, styles.globalFont]}>
                      Call
                    </Text>
                  </TouchableOpacity>
                )}

                {resource.text && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openLink(`sms:${resource.text}`)}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color={Colors.darkNeutral}
                    />
                    <Text style={[styles.actionText, styles.globalFont]}>
                      Text
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    padding: 20,
  },
  paddingContainer: {
    paddingBottom: "20%",
  },
  globalFont: {
    fontFamily: "Afacad",
    color: Colors.darkNeutral,
    letterSpacing: 1,
  },
  top: {
    marginBottom: 10,
  },

  heading: {
    fontSize: 23,
    fontWeight: "500",
    letterSpacing: 1,
  },

  screenInfo: {
    marginBottom: 25,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 1,
  },

  mapButton: {
    backgroundColor: Colors.greyish,
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
  },

  buttonText: {
    color: Colors.darkNeutral,
    fontWeight: "600",
    fontSize: 18,
  },

  resourceCard: {
    backgroundColor: Colors.greyish,
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
  },

  resourceTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.darkNeutral,
  },

  resourceDescription: {
    fontSize: 16,
    lineHeight: 20,
    color: "#555",
    marginBottom: 15,
  },

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.homeBlue,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  actionButtonMap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.homeBlue,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    width: 77,
  },
  actionText: {
    color: Colors.darkBlueText,
    marginLeft: 6,
    fontWeight: "500",
  },

  globalFont: {
    fontFamily: "Afacad",
  },
});

export default ResourcesScreen;
