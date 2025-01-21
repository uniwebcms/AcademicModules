import React from 'react';
import { SafeHtml, Link } from '@uniwebcms/module-sdk';
import { LuCrown, LuLayers2 } from 'react-icons/lu';
import { GrDiamond } from 'react-icons/gr';

const LibrarySection = ({ info, website }) => {
    const { head } = info;

    if (!head?.template?.[0]) return null;

    let templateInfo = head?.template?.[1] || {};

    if (typeof templateInfo === 'string') {
        templateInfo = JSON.parse(templateInfo);
    }

    const stylerId = Array.isArray(templateInfo?.styler)
        ? templateInfo.styler[0]
        : templateInfo.styler;

    const { profile: webstylerProfile } = uniweb.useCompleteProfile('webstyler', stylerId);

    if (stylerId && !webstylerProfile) return null;

    const stylerBasicInfo = webstylerProfile.getBasicInfo();

    const stylerHead = stylerBasicInfo?.head
        ? typeof stylerBasicInfo.head === 'string'
            ? JSON.parse(stylerBasicInfo.head)
            : stylerBasicInfo.head
        : {};

    const { name, metadata = {} } = stylerHead;

    let parsedMeta = metadata
        ? typeof metadata === 'string'
            ? JSON.parse(metadata)
            : metadata
        : {};

    let { type = 'essential', creator = 'Uniweb Studio', tagline = '', url = '' } = parsedMeta;

    let icon,
        price,
        label,
        iconClass = 'w-6 h-6 text-gray-600';
    if (type === 'essential') {
        label = website.localize({ en: 'Essential Library', fr: 'Bibliothèque essentielle' });
        icon = <LuLayers2 className={iconClass} />;
        price = '10';
    } else if (type === 'advanced') {
        label = website.localize({ en: 'Advanced Library', fr: 'Bibliothèque avancée' });
        icon = <LuCrown className={iconClass} />;
        price = '25';
    } else if (type === 'signature') {
        label = website.localize({ en: 'Signature Library', fr: 'Bibliothèque signature' });
        icon = <GrDiamond className={iconClass} />;
        price = '40';
    }

    let Wrapper = url
        ? ({ children, className }) => (
              <Link to={url} className={className} target="_blank">
                  {children}
              </Link>
          )
        : ({ children, className }) => <div className={className}>{children}</div>;

    let body = (
        <Wrapper className={`flex flex-col gap-3`}>
            <div className={`flex items-center gap-3`}>
                {icon}
                <div className={`flex flex-col`}>
                    <p className={`font-medium text-sm text-neutral-800`}>{label}</p>
                    <p className={`text-xs text-neutral-500`}>
                        {website.localize({
                            en: `by ${creator}`,
                            fr: `par ${creator}`,
                        })}
                    </p>
                </div>
            </div>
            <SafeHtml
                className={'text-neutral-600 text-sm'}
                value={`<strong className='text-neutral-800'>${name}</strong> ${
                    tagline ? `—— ${tagline}` : ''
                }`}
            />
        </Wrapper>
    );

    return (
        <>
            <div className={`bg-neutral-100 rounded-lg border border-neutral-200 my-4`}>
                <div className={`p-4 block group`}>{body}</div>
            </div>
            <div className={`flex flex-col`}>
                <p className={`text-sm text-neutral-600`}>
                    {website.localize({
                        en: `Library: $${price}/mo + hosting and add-ons`,
                        fr: `Bibliothèque: $${price}/mo + hébergement et modules complémentaires`,
                    })}
                </p>
                <p className={`text-xs text-neutral-500`}>
                    {website.localize({
                        en: `Free while you customize your site. Pay only when you publish.`,
                        fr: `Gratuit pendant la personnalisation de votre site. Payez uniquement lorsque vous publiez.`,
                    })}
                </p>
            </div>
        </>
    );
};

export default LibrarySection;
