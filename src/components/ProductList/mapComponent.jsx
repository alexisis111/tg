import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {icon} from 'leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import cart from './marker.png';

const MapComponent = () => {
    const mapRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const routingControlRef = useRef(null);


    const handleMapClick = (e) => {
        console.log('Map clicked:', e.latlng);
        setDestination([e.latlng.lat, e.latlng.lng]);
    };

    useEffect(() => {
        const map = mapRef.current;

        if (!hasLocationPermission && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const {latitude, longitude} = position.coords;
                    setUserLocation([latitude, longitude]);
                    setHasLocationPermission(true);
                    if (map) {
                        map.setView([latitude, longitude], map.getZoom());
                    }
                },
                error => {
                    console.error('Error getting user location:', error);
                }
            );
        } else if (userLocation && map) {
            map.setView(userLocation, map.getZoom());
        }

        if (map) {
            map.on('click', handleMapClick);
        }
        return () => {
            if (map) {
                map.off('click', handleMapClick);
            }
        };
    }, [mapRef, userLocation, hasLocationPermission]);

    useEffect(() => {
        const map = mapRef.current;

        if (map && destination && userLocation) {
            if (routingControlRef.current) {
                routingControlRef.current.remove();
            }

            console.log('Creating routing control...');
            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(userLocation[0], userLocation[1]),
                    L.latLng(destination[0], destination[1])
                ],
                routeWhileDragging: true
            }).addTo(map);
        }
    }, [userLocation, destination]);


    const myIcon = icon({
        iconUrl: cart,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });


    const handleRouteButtonClick = () => {
        console.log("Route button clicked");
        console.log("userLocation:", userLocation);
        console.log("destination:", destination);
        console.log("mapRef.current:", mapRef.current);

        if (!destination) {
            alert("Пожалуйста, укажите целевую точку на карте.");
            return;
        }

        if (userLocation && mapRef.current) {
            if (routingControlRef.current) {
                routingControlRef.current.remove();
            }
            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(userLocation[0], userLocation[1]),
                    L.latLng(destination[0], destination[1])
                ],
                routeWhileDragging: true
            }).addTo(mapRef.current);
        }
    };


    return (
        <div>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{height: '400px'}}
                ref={mapRef}
                onClick={handleMapClick}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {userLocation && <Marker position={userLocation} icon={myIcon}/>}
                {destination && <Marker position={destination}/>}
            </MapContainer>
            <button onClick={handleRouteButtonClick}>Построить маршрут</button>
        </div>
    );
}


export default MapComponent;
