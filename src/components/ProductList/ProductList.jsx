import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import cart from './marker.png'

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

    const myIcon = icon({
        iconUrl: cart,
        iconSize: [32, 32], // Размеры изображения
        iconAnchor: [16, 32], // Точка "якоря", куда будет указывать маркер на карте
    });

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px' }} ref={mapRef}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {userLocation && <Marker position={userLocation} icon={myIcon} />}
        </MapContainer>
    );
};

export default MapComponent;
