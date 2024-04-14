import React, { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';

import markerImage from './marker.png'; // Путь к изображению маркера

const MapComponent = () => {
    const [mapglAPI, setMapglAPI] = useState(null);
    const mapRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    useEffect(() => {
        const initializeMap = async () => {
            try {
                const mapgl = await load();
                setMapglAPI(mapgl);
            } catch (error) {
                console.error('Error loading MapGL:', error);
            }
        };

        initializeMap();

        return () => {
            if (mapglAPI) {
                mapglAPI.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (!mapglAPI) {
            return;
        }

        const map = new mapglAPI.Map('map', {
            center: [55.31878, 25.23584],
            zoom: 13,
            key: 'fbcdc7fb-c21f-4fbf-a626-4096221ac644',
        });

        let marker; // Создаем переменную для маркера

        // Создаем маркер только если есть местоположение пользователя
        if (userLocation) {
            // Создаем маркер с изображением
            marker = new mapglAPI.Marker(map, {
                coordinates: userLocation,
                icon: markerImage,
            });
        }

        // Проверяем доступ к геолокации
        if (!hasLocationPermission && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setHasLocationPermission(true);
                    map.setCenter([latitude, longitude]);

                    // Перемещаем маркер, если он уже создан
                    if (marker) {
                        marker.setCoordinates([latitude, longitude]);
                    } else {
                        // Иначе создаем новый маркер
                        marker = new mapglAPI.Marker(map, {
                            coordinates: [latitude, longitude],
                            icon: markerImage,
                        });
                    }
                },
                error => {
                    console.error('Error getting user location:', error);
                }
            );
        }

        return () => {
            if (map) {
                map.destroy();
            }
        };
    }, [mapglAPI, userLocation, hasLocationPermission]);

    return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default MapComponent;
