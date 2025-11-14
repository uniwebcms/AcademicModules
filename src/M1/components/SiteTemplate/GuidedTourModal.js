import React, { useMemo } from 'react';

import { HiChevronRight, HiX } from 'react-icons/hi';

function GuidedTourModal({ video, onClose, foundation, website }) {
    const { type, src } = video || {};

    const isIframe = type === 'youtube' || type === 'vimeo';
    const isVideo = type === 'video';

    // Generate the correct embed URL for iframes using useMemo
    const embedUrl = useMemo(() => {
        if (!src || !isIframe) return null;

        if (type === 'youtube') {
            const match = src.match(
                /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
            );
            const videoId = match ? match[1] : null;
            if (!videoId) return null;

            // Note: Parameters are set for a modal: autoplay, controls, and mute (required for autoplay)
            return `https://www.youtube.com/embed/${videoId}`;
        }

        if (type === 'vimeo') {
            const match = src.match(
                /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/
            );
            const videoId = match ? match[1] : null;
            if (!videoId) return null;

            // Vimeo parameters for autoplay with sound and controls
            return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&controls=1&api=1`;
        }

        return null;
    }, [src, type, isIframe]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8`}
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div
                className={`relative w-full max-w-4xl bg-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
            >
                <button
                    onClick={onClose}
                    className={`absolute top-3 right-3 z-20 p-2 text-neutral-400 hover:text-white bg-neutral-800/50 rounded-full transition-colors`}
                    aria-label="Close"
                >
                    <HiX />
                </button>

                <div className={`w-full aspect-video bg-black flex-shrink-0`}>
                    {isIframe && embedUrl ? (
                        // Render iframe for YouTube/Vimeo
                        <iframe
                            src={embedUrl}
                            title={`${foundation.name} Foundation Tour`}
                            className={`w-full h-full border-0`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : isVideo && src ? (
                        // Render <video> tag for direct files
                        <video
                            src={src}
                            className={`w-full h-full`}
                            controls // Show native browser controls
                            autoPlay // Autoplay the video
                            muted // Mute to allow autoplay in most browsers
                            loop
                            playsInline
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        // Fallback for invalid/missing source
                        <div
                            className={`w-full h-full flex items-center justify-center text-neutral-400`}
                        >
                            {website.localize({
                                en: 'Invalid or unsupported video source',
                                fr: 'Source vidéo invalide ou non prise en charge',
                            })}
                        </div>
                    )}
                </div>

                <div
                    className={`w-full flex-1 overflow-y-auto p-6 space-y-5 border-t border-neutral-700`}
                >
                    <div className={`space-y-2`}>
                        <span className={`text-sm text-neutral-400`}>{foundation.type}</span>
                        <h2 id="modal-title" className={`text-2xl font-bold text-white`}>
                            {foundation.name}
                        </h2>
                        {foundation.description && (
                            <p className={`text-neutral-300`}>{foundation.description}</p>
                        )}
                        {foundation.url && (
                            <a
                                href={foundation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium`}
                            >
                                {website.localize({
                                    en: 'Learn more about this foundation',
                                    fr: 'En savoir plus sur cette fondation',
                                })}
                                <HiChevronRight className={`w-4 h-4`} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GuidedTourModal;
