import { useEffect } from "react";
import L from "leaflet";
import markerImage from "../assets/marker.webp";
import carImage from "../assets/carImage.png";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import routeData from "./data.json";

const customMarkerIcon = new L.Icon({
  iconUrl: markerImage,
  iconSize: [45, 45],
  popupAnchor: [0, -20],
});

const customCarImage = new L.Icon({
  iconUrl: carImage,
  iconSize: [45, 45],
  popupAnchor: [0, -20],
});

const RoutingComponent = ({ map, start, end }) => {
  useEffect(() => {
    if (!map || !start.length || !end.length) return;

    // Add a marker to represent the car
    const marker = L.marker([start[0], start[1]], {
      icon: customCarImage,
    }).addTo(map);

    // Use routeData to simulate vehicle movement
    let timeoutIds = [];

    routeData.forEach((point, index) => {
      const { latitude, longitude, timestamp } = point;

      // Calculate delay based on timestamp difference
      const delay =
        index === 0
          ? 0
          : new Date(timestamp).getTime() -
            new Date(routeData[0].timestamp).getTime();

      const timeoutId = setTimeout(() => {
        marker.setLatLng([latitude, longitude]);
        map.flyTo([latitude, longitude], map.getZoom(), { animate: true });
      }, delay);

      timeoutIds.push(timeoutId);
    });

    return () => {
      // Clean up timeouts
      timeoutIds.forEach((id) => clearTimeout(id));
      if (map) {
        marker.remove();
      }
    };
  }, [map, start, end]);

  return null;
};

export default RoutingComponent;
