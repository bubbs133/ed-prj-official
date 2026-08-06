import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, Text } from "react-native";

import * as Location from "expo-location";

import Colors from "../constants/colors";
import GoBack from "../components/GoBack";

import HeaderCard from "../components/HeaderCard";
import MiniMap from "../components/MiniMap";
import PlaceList from "../components/PlaceList";
import PlaceDetailSheet from "../components/PlaceDetailSheet";

function MapScreen({ navigation }) {
  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission denied", "Location permission is required.");
          setLoading(false);
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});

        setLocation(userLocation.coords);

        await fetchPlaces(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
        );
      } catch (error) {
        console.log("Location error:", error);
        Alert.alert("Location error", "Could not get your location.");
        setLoading(false);
      }
    })();
  }, []);

  // -----------------------------
  // YOUR ORIGINAL OVERPASS REQUEST
  // -----------------------------
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
      console.log(error);

      Alert.alert("Error", "Failed to fetch nearby professionals.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // DISTANCE
  // -----------------------------

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // -----------------------------
  // SORT BY DISTANCE
  // -----------------------------

  const sortedPlaces =
    location == null
      ? []
      : [...places].sort((a, b) => {
          const distanceA = getDistanceFromLatLonInKm(
            location.latitude,
            location.longitude,
            a.lat,
            a.lon,
          );

          const distanceB = getDistanceFromLatLonInKm(
            location.latitude,
            location.longitude,
            b.lat,
            b.lon,
          );

          return distanceA - distanceB;
        });

  // -----------------------------
  // SELECT PLACE
  // -----------------------------

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);

    mapRef.current?.animateTo(place);
  };

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.globalFont}>Location unavailable.</Text>
      </View>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <View style={styles.container}>
      <HeaderCard navigation={navigation} />

      <MiniMap
        ref={mapRef}
        location={location}
        places={sortedPlaces}
        setSelectedPlace={handleSelectPlace}
      />

      <PlaceList
        places={sortedPlaces}
        location={location}
        getDistance={getDistanceFromLatLonInKm}
        onSelect={handleSelectPlace}
      />

      <PlaceDetailSheet
        place={selectedPlace}
        distance={
          selectedPlace
            ? getDistanceFromLatLonInKm(
                location.latitude,
                location.longitude,
                selectedPlace.lat,
                selectedPlace.lon,
              )
            : 0
        }
        onClose={() => setSelectedPlace(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF8", // Soft sand color
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFDF8",
  },

  globalFont: {
    fontFamily: "Afacad",
    color: Colors.darkNeutral,
  },
});

export default MapScreen;
