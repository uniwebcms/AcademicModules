import React, { useState } from 'react';
import { useGetProfile } from '@uniwebcms/module-sdk';
// import { SafeHtml, Link } from '@uniwebcms/core-components';
import { LuCrown, LuLayers2 } from 'react-icons/lu';
import { GrDiamond } from 'react-icons/gr';
import { HiOutlineSparkles } from 'react-icons/hi';
import { HiOutlinePlayCircle } from 'react-icons/hi2';
import { LuInfo } from 'react-icons/lu';

function FoundationTierIcon({ icon, label }) {
    return (
        <div className="group relative flex-shrink-0">
            <span
                className={`flex items-center justify-center p-2 rounded-lg bg-neutral-300 text-neutral-800`}
            >
                {icon}
            </span>
            <span
                className="absolute bottom-full left-1/2 -translate-x-1/3 mb-2 w-max max-w-xs
                   bg-neutral-900 text-neutral-200 text-sm rounded-lg shadow-lg p-2
                   scale-0 group-hover:scale-100 transition-transform origin-bottom z-20
                   border border-neutral-700"
            >
                {label}
            </span>
        </div>
    );
}

const LibrarySection = ({ info, website, setFoundationPreview }) => {
    const { head } = info;

    if (!head?.template?.[0]) return null;

    let templateInfo = head?.template?.[1] || {};

    if (typeof templateInfo === 'string') {
        templateInfo = JSON.parse(templateInfo);
    }

    const stylerId = Array.isArray(templateInfo?.styler)
        ? templateInfo.styler[0]
        : templateInfo.styler;

    const { profile: webstylerProfile } = useGetProfile('webstyler', stylerId);

    if (stylerId && !webstylerProfile) return null;

    const stylerBasicInfo = webstylerProfile.getBasicInfo();

    const stylerHead = stylerBasicInfo?.head
        ? typeof stylerBasicInfo.head === 'string'
            ? JSON.parse(stylerBasicInfo.head)
            : stylerBasicInfo.head
        : {};

    const { name, metadata = {}, description = '' } = stylerHead;

    let parsedMeta = metadata
        ? typeof metadata === 'string'
            ? JSON.parse(metadata)
            : metadata
        : {};

    let {
        type = 'essential',
        creator = 'Uniweb Studio',
        tagline = '',
        url = '',
        video = null,
    } = parsedMeta;

    let icon,
        price,
        label,
        iconClass = 'w-6 h-6 text-neutral-600';
    if (type === 'essential') {
        label = website.localize({ en: 'Essential Library', fr: 'Bibliothèque essentielle' });
        icon = <LuLayers2 className={iconClass} />;
        // price = '10';
    } else if (type === 'advanced') {
        label = website.localize({ en: 'Advanced Library', fr: 'Bibliothèque avancée' });
        icon = <LuCrown className={iconClass} />;
        // price = '25';
    } else if (type === 'signature') {
        label = website.localize({ en: 'Signature Library', fr: 'Bibliothèque signature' });
        icon = <GrDiamond className={iconClass} />;
        // price = '40';
    }

    // let Wrapper = ({ children, className }) => <div className={className}>{children}</div>;

    let body = (
        <div className={`flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
                <div className={`flex items-center gap-3`}>
                    <FoundationTierIcon icon={icon} label={label} />
                    <div className={`flex flex-col`}>
                        <span className="text-sm text-neutral-500">
                            {website.localize({
                                en: 'Foundation',
                                fr: 'Fondation',
                            })}
                        </span>
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-neutral-900">{name}</h2>
                        </div>
                    </div>
                </div>
                {description && (
                    <a
                        href={url || '#'}
                        target={url ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="group relative text-neutral-500 hover:text-neutral-900"
                        onClick={(e) => !url && e.preventDefault()}
                    >
                        <LuInfo className="w-5 h-5" />
                        <span
                            className="absolute bottom-full right-0 mb-2 w-64
                         bg-neutral-900 text-neutral-200 text-sm rounded-lg shadow-xl p-2
                         scale-0 group-hover:scale-100 transition-transform origin-bottom z-20
                         border border-neutral-700"
                        >
                            {description}
                            {url && (
                                <span className="mt-2 pt-2 border-t border-neutral-700 block text-blue-400 hover:underline">
                                    Learn more &rarr;
                                </span>
                            )}
                        </span>
                    </a>
                )}
            </div>
            {/* <SafeHtml
                className={'text-neutral-600 text-xs ml-9'}
                value={`<strong>${name}</strong>${tagline ? ` —— ${tagline}` : ''}`}
            /> */}
            {video ? (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFoundationPreview({
                            open: true,
                            video,
                            foundation: {
                                url,
                                name,
                                type: label,
                                description: description
                                    ? website.localize(description)
                                    : website.localize({
                                          en: `Created by ${creator}`,
                                          fr: `Créé par ${creator}`,
                                      }),
                            },
                        });

                        return false;
                    }}
                    className={`w-full flex items-center justify-center gap-2 bg-neutral-300 hover:bg-neutral-400 text-neutral-700 hover:text-neutral-900 font-semibold py-2 px-4 rounded-lg transition-colors text-sm`}
                >
                    <HiOutlinePlayCircle className={`w-5 h-5`} />
                    {website.localize({
                        en: 'Watch Capabilities',
                        fr: 'Regarder les capacités',
                    })}
                </button>
            ) : null}
        </div>
    );

    return (
        <>
            <div className={`bg-neutral-200/75 rounded-lg border border-neutral-300 my-6`}>
                <div className={`p-3 lg:p-4 block`}>{body}</div>
            </div>
            {/* <div className={`flex flex-col`}>
                <p className={`text-sm text-neutral-200 lg:text-neutral-600`}>
                    {website.localize({
                        en: `Library: $${price}/mo + hosting and add-ons`,
                        fr: `Bibliothèque: $${price}/mo + hébergement et modules complémentaires`,
                    })}
                </p>
                <p className={`text-xs text-neutral-300 lg:text-neutral-500 mt-1`}>
                    {website.localize({
                        en: `Free while you customize your site. Pay only when you publish.`,
                        fr: `Gratuit pendant la personnalisation de votre site. Payez uniquement lorsque vous publiez.`,
                    })}
                </p>
            </div> */}
            <div className={`flex items-start gap-3 text-sm text-neutral-500 pr-4 pl-1`}>
                <HiOutlineSparkles className={`flex-shrink-0 mt-0.5 w-5 h-5`} />
                <span>
                    {website.localize({
                        en: 'This template is a starting point. You can fully change it using all the components and features from its Foundation.',
                        fr: 'Ce modèle est un point de départ. Vous pouvez le modifier entièrement en utilisant tous les composants et fonctionnalités de sa Fondation.',
                    })}
                </span>
            </div>
        </>
    );
};

export default LibrarySection;
