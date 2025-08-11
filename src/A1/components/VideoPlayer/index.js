import React from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

const Video = (props) => {
    const { url } = props;

    return (
        <div className={`w-full h-0 relative pb-[56.25%]`}>
            <iframe
                key={url}
                className={`absolute top-0 left-0 w-full h-full rounded-lg`}
                src={url}
                frameBorder="0"
                allowFullScreen={true}
                width="560"
                height="349"
            />
        </div>
    );
};

const LocalVideo = (props) => {
    const { url, profile } = props;
    const { src } = profile.getAssetInfo(url);
    return <video src={src} className={`w-full h-auto`} controls></video>;
};

export default function (props) {
    const { input, block } = props;

    const profile = input?.profile || null;

    if (!profile) return null;

    const { title, subtitle, head, lastLocalEditTime } = profile.getBasicInfo();

    const { showVideoOnly = false, fitVideo = false } = block.getBlockProperties();

    const { metadata } = head;

    if (!metadata) return null;

    const { embedSrc, url } = metadata;

    let body = null;

    if (embedSrc) {
        body = <Video url={embedSrc}></Video>;
    } else {
        body = <LocalVideo url={url} profile={profile}></LocalVideo>;
    }

    const mainStyle = `xl:max-w-[calc(80vh*(16/9))] xl:min-w-[calc(480px*(16/9))] ${
        fitVideo ? 'w-min' : ''
    }`;

    return (
        <Container
            className={twJoin(
                `${fitVideo ? '' : '!py-0'} flex-1 max-w-full box-border xl:box-content flex-col`
            )}
        >
            <div className={twJoin('mx-auto', mainStyle)}>
                {body}
                {!showVideoOnly && (
                    <div className={`border-text-color-40 pt-3 pb-2 ${subtitle ? 'border-b' : ''}`}>
                        <h2 className="text-lg break-words lg:text-xl 2xl:text-2xl font-semibold">
                            {title}
                        </h2>
                        <p className="text-base lg:text-lg mt-1 text-text-color-80">{subtitle}</p>
                        <p className="text-sm lg:text-base text-text-color-60 mt-1">
                            {lastLocalEditTime}
                        </p>
                    </div>
                )}
            </div>
        </Container>
    );
}
