"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon issues in Leaflet with React
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    latitude: number;
    longitude: number;
    onLocationChange?: (lat: number, lng: number) => void;
}

// Component to handle re-centering the map when coordinates change
function ChangeView({ center }: { center: L.LatLngExpression }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function ReportMap({ latitude, longitude, onLocationChange }: MapProps) {
    const markerRef = useRef<L.Marker>(null);

    const eventHandlers = {
        dragend() {
            const marker = markerRef.current;
            if (marker != null && onLocationChange) {
                const { lat, lng } = marker.getLatLng();
                onLocationChange(lat, lng);
            }
        },
    };

    const center: L.LatLngExpression = [latitude || 13.7563, longitude || 100.5018];

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-border shadow-inner mt-4">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    draggable={true}
                    eventHandlers={eventHandlers}
                    position={center}
                    ref={markerRef}
                />
                <ChangeView center={center} />
            </MapContainer>
            <div className="bg-muted/50 p-2 text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="material-icons-outlined text-xs">info</span>
                <span>Drag the blue marker to fine-tune your location</span>
            </div>
        </div>
    );
}
