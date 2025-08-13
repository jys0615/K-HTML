export interface LatLng {
    lat: number;
    lng: number;
}

export interface Location extends LatLng {
    address?: string;
    timestamp?: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
}