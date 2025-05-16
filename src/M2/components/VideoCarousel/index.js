import React, { useRef, useState } from 'react';
import { twJoin, Link } from '@uniwebcms/module-sdk';
import { IoMdPlay, IoMdPause } from 'react-icons/io';

const liClassNames = [
    'hidden xl:block relative rotate-[-2deg] z-10 3xl:left-[-40px] top-[45%] flex-shrink-0',
    'hidden xl:block relative rotate-[4deg] z-20 3xl:left-[-65px] top-[36%] flex-shrink-0',
    'hidden xl:block relative rotate-[4deg] z-10 left-[-40px] 3xl:left-[-110px] top-[48%] flex-shrink-0',
    'xl:z-[200] inline-block rounded-lg border border-black/10 w-[calc(100vw-40px)] sm:w-[calc(100vw-48px)] xl:w-auto mx-auto relative xl:left-[-136px] flex-shrink-0 shadow-xl',
    'hidden xl:block relative rotate-[-2deg] right-[180px] 3xl:right-[160px] top-[32%] z-[20] flex-shrink-0',
    'hidden xl:block relative rotate-[-3deg] right-[200px] 3xl:right-[180px] top-[41%] z-[40] flex-shrink-0',
    'hidden xl:block relative rotate-[4deg] right-[200px] top-[45%] z-[30] flex-shrink-0',
];

const videoSizes = [
    'border border-white transform object-contain rounded-lg overflow-hidden h-[189px] w-[336px]',
    'border border-white transform object-contain rounded-lg overflow-hidden h-[282px] w-[158px]',
    'border border-white transform object-contain rounded-lg overflow-hidden h-[186px] w-[332px]',
    'max-w-full transform object-contain rounded-lg overflow-hidden h-auto min-[1440px]:h-[625px] min-[1440px]:w-[1112px]',
    'border border-white transform object-contain rounded-lg overflow-hidden h-[186px] w-[330px]',
    'border border-white transform object-contain rounded-lg overflow-hidden h-[288px] w-[162px]',
    'border border-white transform object-contain rounded-lg overflow-hidden h-[180px] w-[316px]',
];

const videoPadding = ['56.25%', '177.78%', '56.25%', '56.25%', '56.25%', '177.78%', '56.25%'];

export default function VideoCarousel(props) {
    const { block } = props;

    const { links, videos } = block.getBlockContent();
    const actionLink = links[0];

    const [clickedIndex, setClickedIndex] = useState(null);
    const videoRefs = useRef([]);

    const handleVideoClick = (index) => {
        const video = videoRefs.current[index];
        if (!video) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }

        setClickedIndex(index);
        setTimeout(() => {
            setClickedIndex(null);
        }, 400);
    };

    return (
        <div className="text-center mx-auto xl:h-[625px] relative overflow-hidden">
            <ul className="xl:absolute xl:left-[50%] xl:translate-x-[-50%] xl:w-[2500px] flex items-center">
                {videos.map((video, index) => {
                    const videoSize = videoSizes[index];
                    const liClassName = liClassNames[index];

                    const src = video.src;

                    return (
                        <li key={index} className={twJoin(liClassName)}>
                            <div className={twJoin(videoSize)}>
                                <div
                                    className="relative"
                                    style={{ paddingBottom: videoPadding[index] }}
                                >
                                    <video
                                        src={src}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        muted
                                        loop
                                        playsInline
                                        autoPlay
                                        onClick={() => handleVideoClick(index)}
                                        ref={(el) => (videoRefs.current[index] = el)}
                                    />
                                    {clickedIndex === index && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div
                                                className={twJoin(
                                                    'animate-ping rounded-full flex items-center justify-center',
                                                    index === 3
                                                        ? 'bg-black/70 w-16 h-16 p-3'
                                                        : 'bg-black/70 w-10 h-10 p-2'
                                                )}
                                            >
                                                {videoRefs.current[index]?.paused ? (
                                                    <IoMdPlay
                                                        className={twJoin(
                                                            'ml-1 text-white w-full h-full'
                                                        )}
                                                    />
                                                ) : (
                                                    <IoMdPause
                                                        className={twJoin(
                                                            'text-white w-full h-full'
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            {actionLink && (
                <Link
                    to={actionLink.href}
                    className="bg-btn-color hover:bg-btn-hover-color p-[6px] sm:p-2 lg:p-[10px] absolute left-[50%] top-[75%] sm:top-[50%] translate-x-[-50%] translate-y-[-50%] cursor-pointer hover:drop-shadow-2xl flex gap-3 items-center rounded-[200px] w-full max-w-[220px] sm:max-w-[250px] lg:max-w-[260px]"
                >
                    <div className="bg-white rounded-[100px] flex items-center justify-center w-10 h-10 pl-3 pr-2 py-2">
                        <IoMdPlay className="text-black w-full h-full" />
                    </div>
                    <p className="text-btn-text-color text-sm sm:text-[15px] lg:text-base font-medium pr-1">
                        {actionLink.label}
                    </p>
                </Link>
            )}
        </div>
    );
}
