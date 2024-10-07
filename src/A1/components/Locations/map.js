import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import './style.css';

const Map = forwardRef((props, ref) => {
    const { apiKey, language, style, zoom = '8', addresses } = props;

    const config = props.config || {
        showAddressInInfoWindow: false
    };

    const [markerPositions, setMarkerPositions] = useState([]);
    const [center, setCenter] = useState({
        lat: 45.424721,
        lng: -75.695
    });

    const [openPositions, setOpenPositions] = useState([]);

    useEffect(() => {
        if (!addresses.length) return;

        // convert lat and lng in each address to be a number
        const pos = addresses.map(({ geo }) => {
            const { lat, lng } = geo;

            return {
                lat: typeof lat === 'string' ? Number(lat) : lat,
                lng: typeof lng === 'string' ? Number(lng) : lng
            };
        });

        setMarkerPositions(pos);
        setCenter(pos[0]);
    }, [addresses.length]);

    useImperativeHandle(
        ref,
        () => ({
            updateCenter: (newCenter) => {
                const { lat, lng } = newCenter;

                setCenter({
                    lat: typeof lat === 'string' ? Number(lat) : lat,
                    lng: typeof lng === 'string' ? Number(lng) : lng
                });

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
        [markerPositions.length]
    );

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        language
    });

    if (isLoaded) {
        return (
            <GoogleMap mapContainerStyle={style} center={center} zoom={Number(zoom)}>
                {markerPositions.map((position, index) => {
                    let { lat, lng } = position;

                    return (
                        <Marker
                            key={index}
                            position={{ lat, lng }}
                            onClick={() => {
                                if (!openPositions.includes(index)) {
                                    setOpenPositions([...openPositions, index]);
                                }
                            }}
                            animation={google.maps.Animation.DROP}>
                            {openPositions.includes(index) &&
                            (addresses[index].title || (config.showAddressInInfoWindow && addresses[index].address)) ? (
                                <InfoWindow
                                    position={{ lat, lng }}
                                    options={{
                                        maxWidth: 300,
                                        minWidth: 100
                                        // pixelOffset: new window.google.maps.Size(0, -38)
                                    }}
                                    onCloseClick={() => {
                                        const newOpenPositions = openPositions.filter((n) => n !== index);
                                        setOpenPositions(newOpenPositions);
                                    }}>
                                    <>
                                        <div className='text-sm font-normal md:text-base lg:text-lg text-text-color-90'>
                                            {addresses[index].title}
                                        </div>
                                        {config.showAddressInInfoWindow ? (
                                            <div className='text-xs font-light md:text-sm lg:text-base text-text-color-70'>
                                                {addresses[index].address}
                                            </div>
                                        ) : null}
                                    </>
                                </InfoWindow>
                            ) : null}
                        </Marker>
                    );
                })}
            </GoogleMap>
        );
    } else if (loadError) return <div>Unable to load Map.</div>;

    return null;
});

export default Map;
