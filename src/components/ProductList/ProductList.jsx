import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
    const mapRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const map = mapRef.current;

        // Получаем текущее местоположение пользователя с помощью HTML5 Geolocation API
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    if (map) {
                        map.setView([latitude, longitude], map.getZoom());
                    }
                },
                error => {
                    console.error('Error getting user location:', error);
                }
            );
        }
    }, [mapRef]);

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px' }} ref={mapRef}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {userLocation && <Marker position={userLocation} />}
        </MapContainer>
    );
};

export default MapComponent;
