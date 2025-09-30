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
    const { url } = props;

    return <video src={url} className={`w-full h-auto`} controls></video>;
};

export default function VideoPlayer(props) {
    const { input } = props;

    const profile = input?.profile || null;

    if (!profile) return null;

    const { title, subtitle, head, lastLocalEditTime } = profile.getBasicInfo();

    const { metadata } = head;

    if (!metadata) return null;

    const { type, embedSrc, url } = metadata;

    let body = null;

    if (type === 'video') {
        body = <Video url={embedSrc}></Video>;
    } else {
        body = <LocalVideo url={url}></LocalVideo>;
    }

    return (
        <Container px="none" py="none">
            <div className="w-full aspect-video">
                {body}
                <div className="pt-3">
                    <h2 className="text-base lg:text-lg 2xl:text-xl font-semibold text-pretty">
                        {title}
                    </h2>
                    <p className="text-sm lg:text-base mt-1 text-text-color-80">{subtitle}</p>
                    <p className="text-sm lg:text-base text-text-color-60 mt-1">
                        {lastLocalEditTime}
                    </p>
                </div>
            </div>
        </Container>
    );
}
