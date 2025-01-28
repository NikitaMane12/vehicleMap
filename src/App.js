import { useState } from "react";
import MapComponent from "./components/MapComponent";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
      <h1 style={{ textAlign: "center" }}>Vehicle Movement on Map</h1>

      {/* Search input field */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for a location (lat,lng)"
        style={{
          border: "1px solid blace",
          padding: "20px",
        }}
      />

      <MapComponent searchQuery={searchQuery} />
    </div>
  );
}

export default App;
