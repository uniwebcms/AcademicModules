import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md';

const VideoPreview = React.memo(({ src, inView, isHovered, onReady }) => {
    const videoRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);

    // Load video when inView
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (inView) {
            video.load();
        } else {
            video.pause();
            setIsReady(false);
        }
    }, [inView]);

    // Handle video readiness
    const handleLoadedData = useCallback(() => {
        setIsReady(true);
        if (onReady) onReady(); // Notify parent card that video is ready
    }, [onReady]);

    // Handle playback based on hover
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isHovered && isReady) {
            video.currentTime = 0;
            video.play().catch((error) => {
                console.error('Video playback failed:', error);
            });
        } else {
            video.pause();
        }
    }, [isHovered, isReady]);

    // Toggle mute state
    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        setIsMuted((prev) => {
            const newMuteState = !prev;
            video.muted = newMuteState;
            return newMuteState;
        });
    }, []);

    // Update progress using timeupdate event
    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
    }, []);

    //  Seek video based on click position
    const seekVideo = useCallback((event) => {
        const video = videoRef.current;
        if (!video) return;

        const boundingRect = event.target.getBoundingClientRect();
        const clickX = event.clientX - boundingRect.left;
        const newTime = (clickX / boundingRect.width) * video.duration;
        video.currentTime = Math.max(0, Math.min(newTime, video.duration));
    }, []);

    return (
        <div className="relative w-full aspect-video">
            <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload={inView ? 'auto' : 'metadata'} // Preload dynamically based on visibility
                onCanPlayThrough={handleLoadedData} // Handle when video is ready
                onTimeUpdate={handleTimeUpdate}
                className="h-full w-full object-cover"
                onError={(e) => {
                    console.error('Video loading failed:', e);
                    setIsReady(false);
                }}
            >
                <source src={src} type="video/webm" />
                <source src={src} type="video/mp4" />
                Your browser does not support the video.
            </video>

            {/* Sound Control */}
            <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="absolute top-3 right-3 bg-neutral-800/70 text-neutral-100 rounded-full p-2 hover:bg-neutral-700/70 focus:outline-none z-10"
            >
                {isMuted ? (
                    <MdVolumeOff className="w-6 h-6 text-inherit" />
                ) : (
                    <MdVolumeUp className="w-6 h-6 text-inherit" />
                )}
            </button>

            {/* Progress Bar */}
            <div
                role="slider"
                aria-label="Video progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                tabIndex={0}
                className="absolute bottom-0 left-0 w-full h-1 bg-gray-700 cursor-pointer hover:h-2 transition-all duration-200"
                onClick={seekVideo}
                onKeyDown={(e) => {
                    const video = videoRef.current;
                    if (!video) return;

                    if (e.key === 'ArrowRight') {
                        video.currentTime = Math.min(video.currentTime + 5, video.duration);
                    } else if (e.key === 'ArrowLeft') {
                        video.currentTime = Math.max(video.currentTime - 5, 0);
                    }
                }}
            >
                <div
                    className="h-full bg-red-500 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
});

export default VideoPreview;
