import React from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { FaArrowRight } from 'react-icons/fa';
import { Link, SafeHtml } from '@uniwebcms/module-sdk';
import Styles from './sidebar.module.scss';
import { LuCrown, LuLayers2 } from 'react-icons/lu';
import { GrDiamond } from 'react-icons/gr';

const LibrarySection = ({ info, website }) => {
    const { head } = info;

    if (!head?.template?.[0]) return null;

    const templateInfo = head?.template?.[1] ? JSON.parse(head.template[1]) : {};

    const libraryInfo = templateInfo?.styler?.[1] || {};

    const { name, metadata = {} } = libraryInfo;

    let parsedMeta = metadata
        ? typeof metadata === 'string'
            ? JSON.parse(metadata)
            : metadata
        : {};

    let { type = 'essential', creator = 'Uniweb Studio', tagline = '' } = parsedMeta;

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

    let body = (
        <div className={`flex flex-col gap-3`}>
            <div className={`flex items-center gap-3`}>
                {icon}
                <div className={`flex flex-col`}>
                    <p className={`font-medium text-sm text-gray-800`}>{label}</p>
                    <p className={`text-xs text-gray-500`}>
                        {website.localize({
                            en: `by ${creator}`,
                            fr: `par ${creator}`,
                        })}
                    </p>
                </div>
            </div>
            <SafeHtml
                className={'text-gray-600 text-sm'}
                value={`<strong className='text-gray-800'>${name}</strong> ${
                    tagline ? `—— ${tagline}` : ''
                }`}
            />
        </div>
    );
    // <div className={`flex items-center gap-2`}>
    //             <p className={`font-medium`}>Price:</p>
    //             <p className={`font-medium`}>{price}</p>
    //         </div>
    return (
        <>
            <div className={`bg-gray-50 rounded-lg border border-gray-100 my-4`}>
                <div className={`p-4 block group`}>{body}</div>
            </div>
            <div className={`flex flex-col`}>
                <p className={`text-sm text-gray-600`}>
                    {website.localize({
                        en: `Library: $${price}/mo + hosting and add-ons`,
                        fr: `Bibliothèque: $${price}/mo + hébergement et modules complémentaires`,
                    })}
                </p>
                <p className={`text-xs text-gray-500`}>
                    {website.localize({
                        en: `Free while you customize your site. Pay only when you publish.`,
                        fr: `Gratuit pendant la personnalisation de votre site. Payez uniquement lorsque vous publiez.`,
                    })}
                </p>
            </div>
        </>
    );
};

export default function (props) {
    const { profile, website, input } = props;
    const info = profile.getBasicInfo();
    const { title: name, subtitle: description } = info;

    const templateSite = profile.getId();

    return (
        <div className={`flex h-full w-full flex-col bg-white`}>
            <div className={`flex flex-col w-full px-4 py-3`}>
                <div className={`flex items-center justify-between`}>
                    <Link
                        to={input.makeHrefToIndex()}
                        className={`group flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-gray-900`}
                    >
                        <HiArrowLeft className={`w-4 h-4 text-gray-600 hover:text-gray-900`} />
                        <span className={`font-medium`}>
                            {website.localize({
                                en: 'Templates',
                                fr: 'Modèles',
                            })}
                        </span>
                    </Link>
                </div>
            </div>
            <div className={`flex flex-col px-4 py-3 flex-1`}>
                <h2 className={`text-lg font-bold`}>{name}</h2>
                {description ? (
                    <div
                        className={
                            `text-gray-600 mt-3 max-h-[300px] overflow-y-auto text-[13px] break-words leading-[140%] flex flex-col space-y-3` +
                            ` ${Styles.Scrollbar}`
                        }
                    >
                        <SafeHtml value={description} makeLinksExternal={true} />
                    </div>
                ) : null}
                <LibrarySection {...props} info={info}></LibrarySection>
                <div className={`w-full mt-auto mb-[120px] justify-center flex`}>
                    <button
                        onClick={() => {
                            const appDomain = uniweb.getAppDomain();
                            fetch(`${appDomain}/temp_resource.php`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json', // Specify content type
                                },
                                body: JSON.stringify({
                                    action: 'store',
                                    data: {
                                        templateSite, //:'_blank'
                                    },
                                }), // Convert data object to JSON string
                            })
                                .then((response) => {
                                    if (!response.ok) {
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }
                                    return response.json(); // Parse the JSON response
                                })
                                .then((data) => {
                                    window.location.replace(data);
                                })
                                .catch((error) => {
                                    console.error('Error:', error); // Handle any errors
                                });
                        }}
                        className={`flex items-center pl-10 pr-8 rounded-full h-12  border border-gray-800 text-gray-800 hover:text-black hover:bg-gray-100 cursor-pointer`}
                        style={{ width: 'fit-content' }}
                    >
                        <p className={`font-medium text-base tracking-wide`}>
                            {website.localize({
                                en: 'Use This Template',
                                fr: 'Utiliser ce modèle',
                            })}
                        </p>
                        <FaArrowRight
                            className={`h-5 w-5 ml-2.5 text-gray-600 hover:text-gray-800`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
