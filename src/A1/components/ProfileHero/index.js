import React from 'react';
import { Image, twJoin, twMerge } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

const backdropStyle = {
    indigo_blue_gradient: 'bg-gradient-to-r from-indigo-800 to-blue-500',
    frosted_glass: 'backdrop-saturate-200 backdrop-blur-sm bg-slate-950 bg-opacity-75',
    understated_gray: 'bg-gray-100 bg-opacity-70 rounded-lg',
    soft_pastel: 'bg-pink-200 bg-opacity-50 bg-opacity-80 rounded-lg',
    default: 'bg-bg-color opacity-80',
};

export default function ProfileHero(props) {
    const { block, input } = props;
    const { themeName } = block;

    const profile = input?.profile;

    if (!profile) return null;

    const {
        show_title = true,
        horizontal_alignment: alignmentH = 'center',
        vertical_alignment: alignmentV = 'center',
        show_back_drop = false,
        show_gradient = false,
        gradient_from_pos = 'bottom',
        text_backdrop_style = 'default',
    } = block.getBlockProperties();

    let gradient_to =
        themeName === 'context__dark'
            ? 'after:to-black'
            : themeName === 'context__light'
            ? 'after:to-white'
            : 'after:to-bg-color';

    const gradient = `after:absolute after:inset-0 after:from-transparent after:z-0 ${gradient_to} ${
        gradient_from_pos === 'top'
            ? 'after:bg-gradient-to-t after:from-50%'
            : 'after:bg-gradient-to-b'
    }`;

    const { title } = profile.getBasicInfo();

    return (
        <Container
            className={twJoin('!py-0', show_gradient ? gradient : '')}
            style={{ height: '500px' }}
        >
            <div className={twJoin('absolute inset-0')}>
                <Image profile={profile} type="banner" className="object-cover w-full h-full" />
            </div>
            <div
                className={twMerge(
                    'flex h-full xl:px-12 2xl:px-32',
                    alignmentH === 'center' ? 'justify-center' : '',
                    alignmentH === 'left' ? 'justify-start' : '',
                    alignmentH === 'right' ? 'justify-end' : '',
                    alignmentV === 'center' ? 'items-center' : '',
                    alignmentV === 'top' ? 'items-start' : '',
                    alignmentV === 'bottom' ? 'items-end' : ''
                )}
            >
                <div
                    className={twMerge(
                        'z-10 max-w-7xl relative mx-6 md:mx-8 flex justify-center text-center  rounded-2xl',
                        show_back_drop
                            ? 'my-16 md:my-20 py-8 md:py-12 px-10 md:px-16'
                            : 'my-8 md:my-10 py-8 md:py-12'
                    )}
                >
                    {show_title ? (
                        <div className="relative lg:w-full md:max-w-2xl lg:max-w-3xl">
                            <h1 className="text-2xl lg:text-3xl 2xl:text-4xl leading-tight">
                                {title}
                            </h1>
                        </div>
                    ) : null}
                    {show_back_drop ? (
                        <div
                            className={twJoin(
                                'absolute w-full h-full top-0 left-0 rounded-2xl',
                                backdropStyle[text_backdrop_style]
                            )}
                            style={{ zIndex: -1 }}
                        ></div>
                    ) : null}
                </div>
            </div>
        </Container>
    );
}
