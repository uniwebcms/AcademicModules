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
                frameBorder='0'
                allowFullScreen={true}
                width='560'
                height='349'
            />
        </div>
    );
};

const LocalVideo = (props) => {
    const { url } = props;

    return <video src={url} className={`w-full h-auto`} controls></video>;
};

export default function (props) {
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

    const mainStyle = 'xl:max-w-[calc(80vh*(16/9))] xl:min-w-[calc(480px*(16/9))]';

    return (
        <Container className={twJoin('!py-0 flex-1 max-w-full box-border xl:box-content flex-col')}>
            <div className={twJoin('mx-auto', mainStyle)}>
                {body}
                <div className='border-b border-text-color-40 pt-3 pb-2'>
                    <h2 className='text-lg break-words lg:text-xl 2xl:text-2xl font-semibold'>{title}</h2>
                    <p className='text-base lg:text-lg mt-1 text-text-color-80'>{subtitle}</p>
                    <p className='text-sm lg:text-base text-text-color-60 mt-1'>{lastLocalEditTime}</p>
                </div>
            </div>
        </Container>
    );
}
