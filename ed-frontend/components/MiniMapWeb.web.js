import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { View, StyleSheet } from "react-native";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Colors from "../constants/colors";

// react-leaflet's default marker icon relies on asset paths that break under
// Metro/webpack bundling, so we draw our own simple pin instead.
function makeIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 22px; height: 22px; border-radius: 50% 50% 50% 0;
      background:${color}; transform: rotate(-45deg);
      border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });
}

const userIcon = makeIcon(Colors.darkNeutral || "#333");
const placeIcon = makeIcon("#78C4D4");

// Grabs the underlying Leaflet map instance so the parent can call flyTo()
function MapController({ onReady }) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map]);
  return null;
}

const MiniMapWeb = forwardRef(({ location, places, setSelectedPlace }, ref) => {
  const mapInstanceRef = useRef(null);

  useImperativeHandle(ref, () => ({
    animateTo(place) {
      if (!mapInstanceRef.current) return;
      mapInstanceRef.current.flyTo([place.lat, place.lon], 15, {
        duration: 0.8,
      });
    },
  }));

  if (!location) return null;

  return (
    <View style={styles.container}>
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <MapController onReady={(map) => (mapInstanceRef.current = map)} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[location.latitude, location.longitude]}
          icon={userIcon}
        >
          <Popup>You are here</Popup>
        </Marker>

        {places.map((place, index) => (
          <Marker
            key={place.id ?? index}
            position={[place.lat, place.lon]}
            icon={placeIcon}
            eventHandlers={{ click: () => setSelectedPlace(place) }}
          >
            <Popup>{place.tags?.name || "Healthcare Facility"}</Popup>
          </Marker>
        ))}
      </MapContainer>
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
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
