import type { Location } from './common';
export type { LatLng, Location } from './common';
export interface Report {
    id: string;
    type: 'driver' | 'transit' | 'post';
    location: Location;
    description: string;
    trafficLevel: 1 | 2 | 3 | 4 | 5;
    createdAt: string;
    userId?: string;
    busRoute?: string; // 대중교통용
}

export interface CreateReportRequest {
    type: 'driver' | 'transit' | 'post';
    location: Location;
    description: string;
    trafficLevel: 1 | 2 | 3 | 4 | 5;
    busRoute?: string;
}

export interface Alert {
    id: string;
    type: 'traffic' | 'accident' | 'construction';
    location: Location;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    createdAt: string;
}