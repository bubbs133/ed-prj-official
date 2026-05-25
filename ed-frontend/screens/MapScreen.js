import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

function MapScreen() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});

      setLocation(userLocation.coords);

      await fetchPlaces(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
      );
    })();
  }, []);

  const fetchPlaces = async (lat, lng) => {
    try {
      const query = `
        [out:json];
        (
          node(around:10000,${lat},${lng})["phone"]["addr:street"]["healthcare"="hospital"];
          node(around:10000,${lat},${lng})["phone"]["addr:street"]["healthcare"="clinic"];
          node(around:10000,${lat},${lng})["phone"]["addr:street"]["healthcare"="psychologist"];
          node(around:10000,${lat},${lng})["phone"]["addr:street"]["healthcare"="psychiatrist"];
          node(around:10000,${lat},${lng})["phone"]["addr:street"]["office"="therapist"];
        );
        out body;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await response.json();

      setPlaces(data.elements || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch nearby places.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Location not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        }}
      >
        {/* User location marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          pinColor="blue"
        />

        {/* Places markers */}
        {places.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.lat,
              longitude: place.lon,
            }}
            title={place.tags?.name || "Healthcare facility"}
            description={`
              ${place.tags?.phone ? `📞 ${place.tags.phone}\n` : ""}
              ${place.tags?.["addr:housenumber"] || ""} 
              ${place.tags?.["addr:street"] || ""}
              ${place.tags?.["addr:city"] || ""}
            `}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
