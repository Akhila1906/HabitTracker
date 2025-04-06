import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useUser } from "@clerk/clerk-react";
import { db } from "../firebaseConfig";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import L from "leaflet";

interface Location {
  lat: number;
  lng: number;
  id?: string;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const Map: React.FC = () => {
  const { user } = useUser();
  const [location, setLocation] = useState<Location | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<Location[]>([]);

  useEffect(() => {
    if (!user) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const currentLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setLocation(currentLocation);

      // Update to Firestore
      await setDoc(doc(db, "locations", user.id), {
        ...currentLocation,
        lastUpdated: new Date(),
      });

      // Fetch nearby users
      const querySnapshot = await getDocs(collection(db, "locations"));
      const nearby: Location[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (docSnap.id === user.id) return; // skip self
        const distance = haversine(
          currentLocation.lat,
          currentLocation.lng,
          data.lat,
          data.lng
        );
        if (distance < 25) {
          nearby.push({ id: docSnap.id, lat: data.lat, lng: data.lng });
        }
      });
      setNearbyUsers(nearby);
    });
  }, [user]);

  if (!location) return <div className="text-center mt-10">Fetching location...</div>;

  return (
    <div className="h-[650px] w-full rounded-lg overflow-hidden">
      <MapContainer center={[location.lat, location.lng]} zoom={13} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.lat, location.lng]} icon={L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', iconSize: [32, 32] })}>
          <Popup>You</Popup>
        </Marker>
        {nearbyUsers.map((friend) => (
          <Marker
            key={friend.id}
            position={[friend.lat, friend.lng]}
            icon={L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png', iconSize: [32, 32] })}
          >
            <Popup>Friend: {friend.id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
