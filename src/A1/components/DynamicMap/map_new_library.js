import React, {
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
    useCallback,
    useMemo,
} from 'react';
import { twMerge } from '@uniwebcms/module-sdk';
import { Image } from '@uniwebcms/core-components';
import { APIProvider, Map, InfoWindow, useMap, Marker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import './style.css';

function getLatLngWithXOffset(map, point, xOffset, zoom = 15) {
    const projection = map.getProjection();
    const scale = Math.pow(2, zoom);

    const pointLatLng = projection.fromPointToLatLng(point);
    const offsetX = xOffset / scale;

    return new google.maps.LatLng(pointLatLng.lat(), pointLatLng.lng() + offsetX);
}

const initCenter = (initialCenter) => {
    if (!initialCenter) {
        return { lat: 45.424721, lng: -75.695 };
    }
    const { lat, lng } = initialCenter;
    return {
        lat: typeof lat === 'string' ? Number(lat) : lat,
        lng: typeof lng === 'string' ? Number(lng) : lng,
    };
};

const initMarkers = (markers) => {
    if (!markers) {
        return [];
    }
    return Object.keys(markers).map((key) => {
        const [lat, lng] = key.split('_');
        return {
            key,
            position: {
                lat: Number(lat),
                lng: Number(lng),
            },
            items: markers[key],
        };
    });
};

const MapComponent = forwardRef((props, ref) => {
    const {
        apiKey,
        initialCenter,
        zoom,
        markers: rawMarkers,
        onItemClicked: onLocationMarkerClicked,
    } = props;

    const defaultCenter = initCenter(initialCenter);
    const locations = initMarkers(rawMarkers);

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                defaultCenter={defaultCenter}
                defaultZoom={Number(zoom)}
                gestureHandling={'greedy'}
                disableDefaultUI
            >
                {locations.length > 0 && (
                    <MapClusters
                        locations={locations}
                        onLocationMarkerClicked={onLocationMarkerClicked}
                    />
                )}
            </Map>
        </APIProvider>
    );
});

const MapClusters = ({ locations, onLocationMarkerClicked }) => {
    const [markers, setMarkers] = useState({});
    const [activeMarkerKey, setActiveMarkerKey] = useState(null);

    const selectedLocation = useMemo(
        () =>
            locations && activeMarkerKey ? locations.find((l) => l.key === activeMarkerKey) : null,
        [locations, activeMarkerKey]
    );

    const map = useMap();
    const clusterer = useMemo(() => {
        if (!map) return null;

        return new MarkerClusterer({ map });
    }, [map]);

    useEffect(() => {
        if (!clusterer) return;

        clusterer.clearMarkers();
        clusterer.addMarkers(Object.values(markers));
    }, [clusterer, markers]);

    // this callback will effectively get passsed as ref to the markers to keep
    // tracks of markers currently on the map
    const setMarkerRef = useCallback((marker, key) => {
        setMarkers((markers) => {
            if ((marker && markers[key]) || (!marker && !markers[key])) return markers;

            if (marker) {
                return { ...markers, [key]: marker };
            } else {
                const { [key]: _, ...newMarkers } = markers;

                return newMarkers;
            }
        });
    }, []);

    const handleInfoWindowClose = useCallback(() => {
        setActiveMarkerKey(null);
    }, []);

    const handleMarkerClick = useCallback((location) => {
        setActiveMarkerKey(location.key);
    }, []);

    return (
        <>
            {locations.map((location, index) => (
                <MapMarker
                    key={index}
                    location={location}
                    setMarkerRef={setMarkerRef}
                    onClick={handleMarkerClick}
                />
            ))}

            {activeMarkerKey && (
                <InfoWindow anchor={markers[activeMarkerKey]} onCloseClick={handleInfoWindowClose}>
                    <InfoWindowContent
                        location={selectedLocation}
                        onLocationMarkerClicked={onLocationMarkerClicked}
                    />
                </InfoWindow>
            )}
        </>
    );
};

const MapMarker = ({ location, onClick, setMarkerRef }) => {
    const handleClick = useCallback(() => onClick(location), [onClick, location]);
    const ref = useCallback(
        (marker) => {
            setMarkerRef(marker, location.key);
        },
        [location.key, setMarkerRef]
    );

    return <Marker ref={ref} position={location.position} onClick={handleClick} />;
};

const InfoWindowContent = ({ location, onLocationMarkerClicked }) => {
    if (!location || !location.items || !location.items.length) return null;

    const { items } = location;

    return (
        <ul className="divide-y divide-neutral-300 max-h-64 overflow-auto">
            {items.map(({ location, profile }, index) => {
                const { contentType, contentId } = profile;
                const { title: profileTitle, subtitle: profileSubtitle } = profile.getBasicInfo();

                return (
                    <li
                        key={index}
                        className={twMerge(
                            'flex items-start space-x-3 group',
                            items.length > 1 ? 'py-2' : '',
                            index === 0 ? 'pt-0' : '',
                            index === items.length - 1 ? 'pb-0' : '',
                            onLocationMarkerClicked ? 'cursor-pointer' : ''
                        )}
                        onClick={() => {
                            if (onLocationMarkerClicked) {
                                onLocationMarkerClicked(contentType, contentId, profileTitle);
                            }
                        }}
                    >
                        <div className="w-12 h-12 flex-shrink-0 mt-1">
                            <Image
                                profile={profile}
                                type={contentType === 'members' ? 'avatar' : 'banner'}
                                rounded="rounded-md"
                            />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm md:text-[15px] lg:text-[16px] text-secondary-800">
                                {profileSubtitle}
                            </p>
                            <p className="text-sm font-medium md:text-[15px] lg:text-[16px] text-neutral-800 group-hover:text-neutral-950">
                                {profileTitle}
                            </p>
                            <p className="text-[13px] font-medium md:text-[15px] text-secondary-600">
                                {location.title}
                            </p>
                            <p className="mt-1.5 text-[13px] md:text-[15px] text-neutral-700 group-hover:text-neutral-800">
                                {location.address}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default MapComponent;
