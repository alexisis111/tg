import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
    const mapRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    useEffect(() => {
        const map = mapRef.current;

        // Проверяем, есть ли уже доступ к геолокации
        if (!hasLocationPermission && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setHasLocationPermission(true); // Устанавливаем флаг разрешения на геолокацию
                    if (map) {
                        map.setView([latitude, longitude], map.getZoom());
                    }
                },
                error => {
                    console.error('Error getting user location:', error);
                }
            );
        } else if (userLocation && map) {
            // Используем старое разрешение, если оно уже есть
            map.setView(userLocation, map.getZoom());
        }
    }, [mapRef, userLocation, hasLocationPermission]);

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px' }} ref={mapRef}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {userLocation && <Marker position={userLocation} />}
        </MapContainer>
    );
};

export default MapComponent;
