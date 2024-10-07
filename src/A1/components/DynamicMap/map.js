import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow, MarkerClusterer } from '@react-google-maps/api';
import { Image, twMerge } from '@uniwebcms/module-sdk';
import './style.css';

function getLatLngWithXOffset(map, point, xOffset, zoom = 15) {
    const projection = map.getProjection();
    const scale = Math.pow(2, zoom);

    const pointLatLng = projection.fromPointToLatLng(point);
    const offsetX = xOffset / scale;

    return new google.maps.LatLng(pointLatLng.lat(), pointLatLng.lng() + offsetX);
}

const Map = forwardRef((props, ref) => {
    const { apiKey, language, style, zoom = '8', markers, initialCenter, onItemClicked } = props;

    const [map, setMap] = useState(null);
    const [markerPositions, setMarkerPositions] = useState([]);
    const [center, setCenter] = useState(
        initialCenter
            ? () => {
                  const { lat, lng } = initialCenter;
                  return {
                      lat: typeof lat === 'string' ? Number(lat) : lat,
                      lng: typeof lng === 'string' ? Number(lng) : lng
                  };
              }
            : {
                  lat: 45.424721,
                  lng: -75.695
              }
    );

    const [openPositions, setOpenPositions] = useState([]);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        language
    });

    useEffect(() => {
        // convert lat and lng in each address to be a number
        if (markers) {
            const markerPositions = Object.keys(markers).map((key) => {
                const [lat, lng] = key.split('_');

                return {
                    lat: Number(lat),
                    lng: Number(lng)
                };
            });

            setMarkerPositions(markerPositions);
        }
    }, [markers]);

    useImperativeHandle(
        ref,
        () => ({
            updateCenterWithOffset: (newCenter, offset = 0) => {
                if (!map) return;

                let { lat, lng } = newCenter;

                lat = typeof lat === 'string' ? Number(lat) : lat;
                lng = typeof lng === 'string' ? Number(lng) : lng;

                const centerPoint = map.getProjection().fromLatLngToPoint(new google.maps.LatLng(lat, lng));
                const newCenterLatLng = getLatLngWithXOffset(map, centerPoint, offset);

                setCenter(newCenterLatLng);
                map.setZoom(15);

                // open corresponding info window
                const markerIndex = markerPositions.findIndex((position) => {
                    return position.lat == newCenter.lat && position.lng == newCenter.lng;
                });

                if (markerIndex > -1) {
                    if (!openPositions.includes(markerIndex)) {
                        setOpenPositions([markerIndex]);
                    }
                }
            }
        }),
        [map]
    );

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback((map) => {
        setMap(null);
    }, []);

    if (isLoaded) {
        return (
            <GoogleMap
                onLoad={onLoad}
                onUnmount={onUnmount}
                mapContainerStyle={style}
                center={center}
                zoom={Number(zoom)}
                options={{ fullscreenControl: false, mapTypeControl: false }}>
                <MarkerClusterer averageCenter={true} enableRetinaIcons={true}>
                    {(clusterer) => {
                        return markerPositions.map((position, index) => {
                            const { lat, lng } = position;

                            const items = markers[`${lat}_${lng}`];

                            return (
                                <Marker
                                    key={index}
                                    clusterer={clusterer}
                                    position={{ lat, lng }}
                                    onClick={() => {
                                        if (!openPositions.includes(index)) {
                                            setOpenPositions([...openPositions, index]);
                                        }
                                    }}>
                                    {openPositions.includes(index) && items.length ? (
                                        <InfoWindow
                                            position={{ lat, lng }}
                                            options={{
                                                maxWidth: 360,
                                                minWidth: 200
                                                // pixelOffset: new window.google.maps.Size(0, -38)
                                            }}
                                            onCloseClick={() => {
                                                const newOpenPositions = openPositions.filter((n) => n !== index);
                                                setOpenPositions(newOpenPositions);
                                            }}>
                                            <ul className='divide-y divide-neutral-300 max-h-64 overflow-auto'>
                                                {items.map(({ location, profile }, index) => {
                                                    const { contentType, contentId } = profile;
                                                    const { title: profileTitle, subtitle: profileSubtitle } =
                                                        profile.getBasicInfo();

                                                    return (
                                                        <li
                                                            key={index}
                                                            className={twMerge(
                                                                'flex items-start space-x-3 group',
                                                                items.length > 1 ? 'py-2' : '',
                                                                index === 0 ? 'pt-0' : '',
                                                                index === items.length - 1 ? 'pb-0' : '',
                                                                onItemClicked ? 'cursor-pointer' : ''
                                                            )}
                                                            onClick={() => {
                                                                if (onItemClicked) {
                                                                    onItemClicked(contentType, contentId, profileTitle);
                                                                }
                                                            }}>
                                                            <div className='w-12 h-12 flex-shrink-0 mt-1'>
                                                                <Image
                                                                    profile={profile}
                                                                    type={
                                                                        contentType === 'members' ? 'avatar' : 'banner'
                                                                    }
                                                                    rounded='rounded-md'
                                                                />
                                                            </div>
                                                            <div className='space-y-1'>
                                                                <p className='text-sm md:text-[15px] lg:text-[16px] text-secondary-800'>
                                                                    {profileSubtitle}
                                                                </p>
                                                                <p className='text-sm font-medium md:text-[15px] lg:text-[16px] text-neutral-800 group-hover:text-neutral-950'>
                                                                    {profileTitle}
                                                                </p>
                                                                <p className='text-[13px] font-medium md:text-[15px] text-secondary-600'>
                                                                    {location.title}
                                                                </p>
                                                                <p className='mt-1.5 text-[13px] md:text-[15px] text-neutral-700 group-hover:text-neutral-800'>
                                                                    {location.address}
                                                                </p>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </InfoWindow>
                                    ) : null}
                                </Marker>
                            );
                        });
                    }}
                </MarkerClusterer>
            </GoogleMap>
        );
    } else if (loadError) return <div>Unable to load Map.</div>;

    return null;
});

export default Map;
