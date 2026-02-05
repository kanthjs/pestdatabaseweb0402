"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import "leaflet.heat"; // This usually attaches to L.heatLayer

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

// Heatmap Layer Component
function HeatmapLayer({ points }: { points: [number, number, number][] }) {
    const map = useMap();

    useEffect(() => {
        if (!points.length) return;

        // Dynamic import for leaflet.heat to avoid SSR issues and ensure L is present
        import("leaflet.heat").then(() => {
            const heat = (L as any).heatLayer(points, {
                radius: 25,
                blur: 15,
                maxZoom: 10,
            });

            heat.addTo(map);

            return () => {
                map.removeLayer(heat);
            };
        }).catch(err => console.error("Failed to load leaflet.heat", err));

    }, [points, map]);

    return null;
}

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
    const [showHeatmap, setShowHeatmap] = useState(false);

    // Prepare heatmap data: [lat, lng, intensity]
    // Intensity normalized 0-1 based on severity
    const heatPoints: [number, number, number][] = reports.map(r => [
        r.lat,
        r.lng,
        r.severity / 100 // intensity
    ]);

    return (
        <div className="relative h-[600px] w-full rounded-xl overflow-hidden border border-border">
            <div className="absolute top-4 right-4 z-[1000] bg-white/90 p-2 rounded-md shadow-md">
                <Button
                    variant={showHeatmap ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                >
                    {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
                </Button>
            </div>

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

                {showHeatmap ? (
                    <HeatmapLayer points={heatPoints} />
                ) : (
                    reports.map((report) => (
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
                    ))
                )}
            </MapContainer>
        </div>
    );
}
