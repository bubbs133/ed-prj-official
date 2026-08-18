import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Colors from "../constants/colors";

const MiniMapWeb = forwardRef(({ location, places, setSelectedPlace }, ref) => {
  const mapRef = useRef(null);

  // Allows the parent (MapScreen) to move the camera
  useImperativeHandle(ref, () => ({
    animateTo(place) {
      if (!mapRef.current) return;

      mapRef.current.animateToRegion(
        {
          latitude: place.lat,
          longitude: place.lon,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        800,
      );
    },
  }));

  if (!location) return null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={false}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.04,
        }}
      >
        {/* User Marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          pinColor={Colors.darkNeutral}
        />

        {/* Your fetched Overpass places */}
        {places.map((place, index) => (
          <Marker
            key={place.id ?? index}
            coordinate={{
              latitude: place.lat,
              longitude: place.lon,
            }}
            title={place.tags?.name || "Healthcare Facility"}
            description={place.tags?.phone || "Tap for details"}
            onPress={() => setSelectedPlace(place)}
          />
        ))}
      </MapView>
    </View>
  );
});

export default MiniMapWeb;

const styles = StyleSheet.create({
  container: {
    height: 240,

    marginHorizontal: 20,
    marginBottom: 25,

    borderRadius: 28,
    overflow: "hidden",

    backgroundColor: "white",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 6,
  },

  map: {
    flex: 1,
  },
});
