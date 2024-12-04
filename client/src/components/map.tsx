"use client";

import { useEffect, useRef, useState } from "react";

// Define the interface for Spot data
interface Spot {
  id: number;
  spotName: string;
  latitude: number;
  longitude: number;
  image: string;
}

export default function CustomMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);

  // Fetch spots data from the backend API
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/spots`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch spots: ${response.statusText}`);
        }

        const data: Spot[] = await response.json();
        setSpots(data);
      } catch (error) {
        console.error("Error fetching spots:", error);
      }
    };

    fetchSpots();
  }, []);

  // Initialize the Google Map
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
        center: { lat: 34.0522, lng: -118.2437 }, // Default to Los Angeles
        zoom: 10,
        mapTypeId: "hybrid",
        styles: mapStyle, // Apply the custom style
      });
      setMap(newMap);
    }
  }, [map]);

  // Add Spot markers to the map
  useEffect(() => {
    if (map) {
      spots.forEach((spot) => {
        const marker = new google.maps.Marker({
          position: { lat: spot.latitude, lng: spot.longitude },
          map: map,
          title: spot.spotName,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="text-align:center;">
                      <h3>${spot.spotName}</h3>
                      <a href="/spot/${spot.id}" target="_blank">
                        <img src="${spot.image}" alt="${spot.spotName}" style="width:100px; height:auto;" />
                      </a>
                    </div>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    }
  }, [map, spots]);

  // Locate user and add a marker
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
              icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom icon for user location
            });
            setUserMarker(newMarker);
          }
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={mapRef}
        style={{ height: "100vh", width: "100%", position: "absolute" }}
      ></div>
      <button
        onClick={handleLocateUser}
        style={{
          position: "relative",
          bottom: "-77vh",
          left: "10px",
          zIndex: 100,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "50%",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
