declare module 'leaflet.heat' {
    import * as L from 'leaflet';

    interface HeatLayerOptions {
        minOpacity?: number;
        maxZoom?: number;
        max?: number;
        radius?: number;
        blur?: number;
        gradient?: { [key: number]: string };
    }

    type LatLngIntensity = [number, number, number];

    interface HeatLayer extends L.Layer {
        setOptions(options: HeatLayerOptions): HeatLayer;
        addLatLng(latlng: L.LatLngExpression | LatLngIntensity): HeatLayer;
        setLatLngs(latlngs: L.LatLngExpression[] | LatLngIntensity[]): HeatLayer;
        redraw(): HeatLayer;
    }

    function heatLayer(
        latlngs: L.LatLngExpression[] | LatLngIntensity[],
        options?: HeatLayerOptions
    ): HeatLayer;

    export = heatLayer;
}
