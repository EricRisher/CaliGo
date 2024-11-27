import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import Image from "next/image";

// Define the Spot interface to match the shape passed from MapPage
interface Spot {
  id: number;
  spotName: string;
  latitude: number;
  longitude: number;
  image: string;
}

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: "/icons/pin.png",
  iconSize: [32, 32],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function LocateButton({
  setUserLocation,
}: {
  setUserLocation: (latlng: L.LatLng) => void;
}) {
  const map = useMap();

  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLatLng = new L.LatLng(latitude, longitude);
          map.setView(userLatLng, 13); // Adjust zoom level as needed
          setUserLocation(userLatLng);
        },
        () => {
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <button onClick={handleClick} className="absolute bottom-5 left-4 z-5 ">
      <Image
        src="/icons/mylocation.png"
        alt="Find Location"
        width={32}
        height={32}
        className="block z-1000"
      />
    </button>
  );
}

export default function CustomMap({ spots }: { spots: Spot[] }) {
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);

  return (
    <div className="relative z-10">
      <MapContainer
        center={[34.0522, -118.2437]} // Default center
        zoom={10}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <a href={`/spot/${spot.id}`}>{spot.spotName}</a>
            </Popup>
          </Marker>
        ))}
        {userLocation && (
          <Marker position={userLocation} icon={markerIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        <LocateButton setUserLocation={setUserLocation} />
      </MapContainer>
    </div>
  );
}
