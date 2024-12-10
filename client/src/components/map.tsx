"use client";

import { useEffect, useRef, useState } from "react";

interface Spot {
  id: number;
  spotName: string;
  latitude: number;
  longitude: number;
  image: string;
}

interface CustomMapProps {
  spots: Spot[];
  className?: string; // Add an optional className prop
}

export default function CustomMap({ spots, className }: CustomMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userMarker, setUserMarker] = useState<google.maps.marker.AdvancedMarkerClickEvent | null>(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      const mapStyle = [
        {
          featureType: "administrative",
          elementType: "geometry",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "poi",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "road",
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "transit",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
      ];

      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 34.0522, lng: -118.2437 },
        zoom: 8,
        mapTypeId: "hybrid",
        styles: mapStyle, // Apply the custom style here
      });
      setMap(newMap);
    }
  }, [map]);

  // Add Spots to Map
  useEffect(() => {
    if (map) {
      spots.forEach((spot) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: spot.latitude, lng: spot.longitude },
          map: map,
          title: spot.spotName,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<a href="/spot/${spot.id}">${spot.spotName}</a>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    }
  }, [map, spots]);

  // Locate User and Add Marker
  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLatLng = new google.maps.LatLng(latitude, longitude);
          map?.setCenter(userLatLng);
          map?.setZoom(13);

          if (userMarker) {
            userMarker.setPosition(userLatLng);
          } else {
            const newMarker = new google.maps.Marker({
              position: userLatLng,
              map: map,
              title: "You are here",
            });
            setUserMarker(newMarker);
          }
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
    <div className="relative">
      <div
        ref={mapRef}
        className={`map mt-[82px] ${className || ""}`}
        style={{
          width: "100%",
          position: "absolute",
        }}
      ></div>
      <button
        onClick={handleLocateUser}
        style={{
          position: "absolute",
          zIndex: 100,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "50%",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          top: "74vh",
          left: "2%",
        }}
      >
        <img
          src="/icons/mylocation.png"
          alt="Locate Me"
          width={32}
          height={32}
        />
      </button>
    </div>
  );
}
