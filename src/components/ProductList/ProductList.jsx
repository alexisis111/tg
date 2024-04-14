import React, {useEffect, useRef, useState} from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Routing } from 'leaflet-routing-machine';

const MapComponent = () => {
    const mapRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (mapRef.current) {
            const map = mapRef.current.leafletElement;

            // Добавляем слой OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Запрос геолокации
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        setUserLocation([latitude, longitude]);
                    },
                    error => {
                        console.error('Error getting user location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by your browser');
            }

            // Создаем маршрут от точки A до точки B
            L.Routing.control({
                waypoints: [
                    L.latLng(startPoint[0], startPoint[1]),
                    L.latLng(endPoint[0], endPoint[1])
                ],
                routeWhileDragging: true
            }).addTo(map);
        }
    }, []);

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px' }} ref={mapRef}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {userLocation && <Marker position={userLocation} />}
        </MapContainer>
    );
};

export default MapComponent;
