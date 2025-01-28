import { useState, useRef } from "react";
import markerImage from "../assets/marker.webp";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useGeoLocation from "../customHooks/useGeoLocation";
import { Button, TextField } from "@mui/material";
import RoutingComponent from "./RoutingComponent";

const center = { lat: 28.7041, lng: 77.1025 };
const markerIcon = new L.Icon({
  iconUrl: markerImage,
  iconSize: [45, 45],
  popupAnchor: [0, -20],
});

const MapComponent = ({ searchQuery }) => {
  const [position, setPosition] = useState(center);
  const [routes, setRoutes] = useState({
    start: [],
    end: [],
  });
  const mapRef = useRef();
  const ZOOM = 9;

  const myLocation = useGeoLocation();

  const showMyLocation = () => {
    if (myLocation.loaded) {
      mapRef.current.flyTo(
        [myLocation.coordinates.lat, myLocation.coordinates.lng],
        ZOOM,
        { animate: true }
      );
    } else {
      alert(myLocation.error);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;

        if (routes.start.length === 0) {
          setRoutes({
            ...routes,
            start: [lat, lng],
          });
        } else {
          setRoutes({
            ...routes,
            end: [lat, lng],
          });
        }
      },
    });
    return null;
  };

  // Function to handle search and move map to searched location
  const handleSearch = () => {
    if (searchQuery) {
      const coords = searchQuery.split(",");

      // Check if coordinates are in the correct format (lat, lng)
      if (coords.length === 2) {
        const lat = parseFloat(coords[0].trim());
        const lng = parseFloat(coords[1].trim());

        // Check if the parsed values are valid numbers
        if (!isNaN(lat) && !isNaN(lng)) {
          // Move the map to the new coordinates
          mapRef.current.flyTo([lat, lng], ZOOM, { animate: true });
          setPosition({ lat, lng });
        } else {
          alert("Invalid coordinates. Please enter valid lat,lng.");
        }
      } else {
        alert("Please provide coordinates in the format: latitude,longitude");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <TextField
          label="Search (lat,lng)"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => e.target.value}
          style={{ width: "240px" }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div
        style={{
          width: "100%",
          height: "70vh",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <MapContainer
          center={position}
          zoom={ZOOM}
          ref={mapRef}
          style={{ height: "60%", width: "80%", borderRadius: "10%" }}
        >
          <TileLayer
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=tnJjWx0rdsXDXVYRkvPC"
          />
          <MapClickHandler />
          {myLocation.loaded && (
            <Marker
              position={[
                myLocation.coordinates.lat,
                myLocation.coordinates.lng,
              ]}
              icon={markerIcon}
            />
          )}
          {routes.start.length !== 0 && routes.end.length !== 0 && (
            <RoutingComponent
              map={mapRef.current}
              start={routes.start}
              end={routes.end}
            />
          )}
        </MapContainer>
      </div>

      <div
        style={{
          display: "flex",
          gap: "40px",
        }}
      >
        <Button onClick={showMyLocation} variant="contained">
          Show My Location🌐
        </Button>
        <Button
          onClick={() => setRoutes({ start: [], end: [] })}
          variant="contained"
        >
          Reset the Route
        </Button>
      </div>
    </div>
  );
};
export default MapComponent;
