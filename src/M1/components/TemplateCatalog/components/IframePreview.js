import React, { useCallback, useEffect, useRef, useState } from 'react';
import previewMessenger from './previewMessenger';
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md';

const IframePreview = React.memo(({ src, type, inView, isHovered, onReady }) => {
    const iframeRef = useRef(null);
    const progressInterval = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Helper to extract video ID
    const getVideoId = useCallback(() => {
        if (!src) return '';

        if (type === 'youtube') {
            const match = src.match(
                /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
            );
            return match ? match[1] : src;
        } else if (type === 'vimeo') {
            const match = src.match(
                /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/
            );
            return match ? match[1] : src;
        }
        return src;
    }, [src, type]);

    // Generate embed URL with appropriate parameters
    const getEmbedUrl = useCallback(() => {
        const videoId = getVideoId();

        if (type === 'youtube') {
            // Added mute=1 for initial state
            return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&autoplay=0&controls=0&mute=1&rel=0&playsinline=1`;
        } else if (type === 'vimeo') {
            // Added muted=1 for initial state
            return `https://player.vimeo.com/video/${videoId}?api=1&autoplay=0&controls=0&muted=1`;
        }
        return '';
    }, [type, getVideoId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
                progressInterval.current = null;
            }
            setCurrentTime(0);
            setDuration(0);
        };
    }, []);

    // YouTube duration handling useEffect (working)
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !isLoaded || type !== 'youtube') return;

        let durationInterval = null;

        const handleMessage = (event) => {
            try {
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                // console.log('YouTube message received:', data);

                if (data.event === 'onReady') {
                    // console.log('YouTube player ready');
                    // Only start polling if we don't have a valid duration yet
                    if (duration === 0 && !durationInterval) {
                        // console.log('Starting duration polling');
                        durationInterval = setInterval(() => {
                            previewMessenger.sendCommand(iframe, type, 'listening');
                        }, 500);
                    }
                } else if (data.event === 'infoDelivery') {
                    // Check both possible duration locations
                    const receivedDuration =
                        data.info?.duration || data.info?.progressState?.duration;

                    const currentTime = data.info?.currentTime || data.info?.progressState?.current;

                    if (duration === 0 && receivedDuration) {
                        if (typeof receivedDuration === 'number' && receivedDuration > 0) {
                            // console.log('Valid duration received:', receivedDuration);
                            setDuration(receivedDuration);
                            // Clear interval since we have a valid duration
                            if (durationInterval) {
                                // console.log('Stopping duration polling');
                                clearInterval(durationInterval);
                                durationInterval = null;
                            }
                        }
                    }

                    if (currentTime) {
                        setCurrentTime(currentTime);
                    }
                }
            } catch (error) {
                console.error('Error handling YouTube message:', error);
            }
        };

        window.addEventListener('message', handleMessage);

        // Initial listening command
        if (duration === 0) {
            // console.log('Sending initial listening command');
            previewMessenger.sendCommand(iframe, type, 'listening');
        }

        // Cleanup
        return () => {
            window.removeEventListener('message', handleMessage);
            if (durationInterval) {
                // console.log('Cleaning up duration polling');
                clearInterval(durationInterval);
                durationInterval = null;
            }
        };
    }, [isLoaded, type, duration]);

    // Vimeo duration handling and progress tracking (working)
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !isLoaded || type !== 'vimeo') return;

        const handleMessage = (event) => {
            try {
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                // console.log('Vimeo message received:', data);

                if (data.event === 'ready') {
                    // console.log('Vimeo player ready');
                    previewMessenger.sendCommand(iframe, type, 'getDuration');
                } else if (data.method === 'getDuration' && typeof data.value === 'number') {
                    // console.log('Vimeo duration received:', data.value);
                    setDuration(data.value);
                } else if (data.method === 'getCurrentTime' && typeof data.value === 'number') {
                    // console.log('Vimeo currentTime received:', data.value);
                    setCurrentTime(data.value);
                }
            } catch (error) {
                console.error('Error handling Vimeo message:', error);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [isLoaded, type]);

    // Handle video visibility
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !isLoaded) return;

        if (!inView) {
            previewMessenger.sendCommand(iframe, type, 'stop');

            // handle video progress
            setCurrentTime(0);
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
                progressInterval.current = null;
            }
        }
    }, [inView, isLoaded, type]);

    // // Handle hover state and progress tracking (work and not improved)
    // useEffect(() => {
    //     const iframe = iframeRef.current;
    //     if (!iframe || !isLoaded) return;

    //     if (isHovered) {
    //         // Start playing from beginning when hovered
    //         previewMessenger.sendCommand(iframe, type, 'play', { startTime: 0 });

    //         // start progress tracking for vimeo
    //         if (type === 'vimeo') {
    //             progressInterval.current = setInterval(() => {
    //                 previewMessenger.sendCommand(iframe, type, 'getCurrentTime', {
    //                     callback: (time) => setCurrentTime(time),
    //                 });
    //             }, 1000);
    //         }
    //     } else {
    //         previewMessenger.sendCommand(iframe, type, 'stop');

    //         // stop progress tracking
    //         if (progressInterval.current) {
    //             clearInterval(progressInterval.current);
    //             progressInterval.current = null;
    //         }
    //     }
    // }, [isHovered, type, isLoaded]);

    // Handle hover state and progress tracking (improved)
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !isLoaded) return;

        if (isHovered) {
            // Reset current time when starting playback
            setCurrentTime(0);

            // Start playing from beginning when hovered
            previewMessenger.sendCommand(iframe, type, 'play', { startTime: 0 });

            // Only set up interval for Vimeo since YouTube sends automatic updates
            if (type === 'vimeo') {
                progressInterval.current = setInterval(() => {
                    previewMessenger.sendCommand(iframe, type, 'getCurrentTime');
                }, 1000);
            }
        } else {
            previewMessenger.sendCommand(iframe, type, 'stop');

            // Reset current time when stopping
            setCurrentTime(0);

            // Clear interval if exists
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
                progressInterval.current = null;
            }
        }

        // Cleanup on unmount or dependency change
        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
                progressInterval.current = null;
            }
            // Reset time on cleanup
            setCurrentTime(0);
        };
    }, [isHovered, type, isLoaded]);

    // Toggle mute state
    const toggleMute = useCallback(() => {
        const iframe = iframeRef.current;
        if (!iframe || !isLoaded) return;

        setIsMuted((prev) => {
            const newMuteState = !prev;
            previewMessenger.sendCommand(iframe, type, newMuteState ? 'mute' : 'unMute');
            return newMuteState;
        });
    }, [type, isLoaded]);

    // Handle seeking
    const handleSeek = useCallback(
        (e) => {
            const iframe = iframeRef.current;
            if (!iframe || !isLoaded || !duration) return;

            const progressBar = e.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const seekPercentage = x / rect.width;
            const seekTime = seekPercentage * duration;

            setCurrentTime(seekTime);
            previewMessenger.sendCommand(iframe, type, 'seekTo', { startTime: seekTime });
        },
        [isLoaded, type, duration]
    );

    const handleIframeLoad = () => {
        setIsLoaded(true);
        if (onReady) onReady();
    };

    const handleIframeError = (e) => {
        console.error(`${type} video loading failed:`, e);
        setIsLoaded(false);
    };

    // Calculate progress percentage
    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="relative w-full aspect-video">
            <iframe
                ref={iframeRef}
                src={getEmbedUrl()}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                // onLoad={() => {
                //     // console.log('Iframe loaded');
                //     setIsLoaded(true);
                //     if (onReady) onReady();
                // }}
                // onError={(e) => {
                //     console.error(`${type} video loading failed:`, e);
                //     setIsLoaded(false);
                // }}
            />

            {/* Sound Control */}
            <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="absolute top-3 right-3 bg-neutral-800/70 text-neutral-100 rounded-full p-2 hover:bg-neutral-700/70 focus:outline-none"
            >
                {isMuted ? (
                    <MdVolumeOff className="w-6 h-6 text-inherit" aria-hidden="true" />
                ) : (
                    <MdVolumeUp className="w-6 h-6 text-inherit" aria-hidden="true" />
                )}
            </button>

            {/* Progress Bar */}
            <div
                className="absolute bottom-0 left-0 w-full h-1 bg-gray-700 cursor-pointer hover:h-2 transition-all duration-200"
                onClick={handleSeek}
            >
                <div
                    className="h-full bg-red-500 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
});

export default IframePreview;
