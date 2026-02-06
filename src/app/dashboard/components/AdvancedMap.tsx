"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Marker Icon Setup
const getMarkerIcon = (severity: number) => {
    let color = "#22c55e"; // green
    if (severity >= 80) color = "#ef4444"; // red
    else if (severity >= 60) color = "#f97316"; // orange
    else if (severity >= 30) color = "#eab308"; // yellow

    // Simple DivIcon circles
    return L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
};

interface AdvancedMapProps {
    reports: Array<{
        id: string;
        lat: number;
        lng: number;
        severity: number;
        incidence: number;
        pestName: string;
    }>;
    center?: [number, number];
    zoom?: number;
}

export default function AdvancedMap({ reports, center = [15.8700, 100.9925], zoom = 6 }: AdvancedMapProps) {
    return (
        <div className="relative h-[600px] w-full rounded-xl overflow-hidden border border-border">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {reports.map((report) => (
                    <Marker
                        key={report.id}
                        position={[report.lat, report.lng]}
                        icon={getMarkerIcon(report.severity)}
                    >
                        <Popup>
                            <div className="text-sm">
                                <h3 className="font-bold">{report.pestName}</h3>
                                <p>Severity: {report.severity}%</p>
                                <p>Incidence: {report.incidence}%</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
