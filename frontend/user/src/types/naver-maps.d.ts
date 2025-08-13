declare global {
    interface Window {
        naver: any;
    }
}

// 네이버 지도 관련 타입 정의
declare namespace naver {
    namespace maps {
        class Map {
            constructor(element: HTMLElement, options: any);
            setCenter(latlng: LatLng): void;
            getCenter(): LatLng;
            setZoom(zoom: number): void;
            getZoom(): number;
            fitBounds(bounds: LatLngBounds): void;
        }

        class LatLng {
            constructor(lat: number, lng: number);
            x: number;
            y: number;
        }

        class LatLngBounds {
            constructor();
            extend(latlng: LatLng): void;
        }

        class Marker {
            constructor(options: any);
            setMap(map: Map | null): void;
        }

        namespace Event {
            function addListener(target: any, eventName: string, listener: Function): void;
            function clearInstanceListeners(target: any): void;
        }

        namespace Service {
            const Status: {
                ERROR: string;
            };

            function reverseGeocode(options: any, callback: Function): void;
        }
    }
}

export { };