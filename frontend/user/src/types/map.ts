import type { LatLng, Report } from './common';

export interface MapState {
    center: LatLng;
    zoom: number;
    markers: MapMarker[];
}

export interface MapMarker {
    id: string;
    position: LatLng;
    type: 'report' | 'alert';
    data: Report | Alert;
}