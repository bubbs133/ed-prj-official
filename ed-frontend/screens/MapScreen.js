import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, Text } from "react-native";

import * as Location from "expo-location";

import Colors from "../constants/colors";
import GoBack from "../components/GoBack";

import HeaderCard from "../components/HeaderCard";
import MiniMapWeb from "../components/MiniMapWeb.web";
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
  // DISTANCE
  // -----------------------------

  const deg2rad = (deg) => deg * (Math.PI / 180);

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
  // DRIVE TIME (OSRM)
  // -----------------------------

  const fetchDriveTimes = async (lat, lng, elements) => {
    if (elements.length === 0) return elements;

    try {
      const coords = [
        `${lng},${lat}`,
        ...elements.map((p) => `${p.lon},${p.lat}`),
      ].join(";");

      const destinations = elements.map((_, i) => i + 1).join(",");

      const url = `https://router.project-osrm.org/table/v1/driving/${coords}?sources=0&destinations=${destinations}&annotations=duration`;

      const response = await fetch(url);
      const data = await response.json();

      const durations = data?.durations?.[0] || [];

      return elements.map((place, i) => ({
        ...place,
        driveMinutes: durations[i] != null ? durations[i] / 60 : null,
      }));
    } catch (error) {
      console.log("OSRM routing error:", error);
      // Rough fallback: straight-line distance at an assumed ~35 km/h city average
      return elements.map((place) => ({
        ...place,
        driveMinutes:
          (getDistanceFromLatLonInKm(lat, lng, place.lat, place.lon) / 35) * 60,
      }));
    }
  };

  // -----------------------------
  // OVERPASS REQUEST
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
      const elements = data.elements || [];

      const withDriveTimes = await fetchDriveTimes(lat, lng, elements);

      setPlaces(withDriveTimes);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch nearby professionals.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // SORT (by drive time when we have it, else distance)
  // -----------------------------

  const sortedPlaces =
    location == null
      ? []
      : [...places].sort((a, b) => {
          if (a.driveMinutes != null && b.driveMinutes != null) {
            return a.driveMinutes - b.driveMinutes;
          }

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

      <MiniMapWeb
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
        driveMinutes={selectedPlace?.driveMinutes}
        onClose={() => setSelectedPlace(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF8",
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
