import React from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { Link, SafeHtml } from '@uniwebcms/core-components';
import { LiaExternalLinkSquareAltSolid } from 'react-icons/lia';
import { TbDeviceMobile } from 'react-icons/tb';
import Styles from './sidebar.module.scss';
import LibrarySection from './LibrarySection';

export default function (props) {
    const { profile, website, input, screen, setScreen, iframeSrc } = props;
    const info = profile.getBasicInfo();
    const { title: name, subtitle: description } = info;

    const templateSite = profile.getId();

    return (
        <div className={`flex h-full w-full flex-col bg-neutral-50`}>
            <div className={`flex flex-col w-full px-4 py-3`}>
                <div className={`flex items-center justify-between`}>
                    <Link
                        to={input.makeHrefToIndex()}
                        className={`group flex items-center space-x-1 cursor-pointer text-neutral-600 hover:text-neutral-900`}
                    >
                        <HiArrowLeft
                            className={`w-4 h-4 text-neutral-600 hover:text-neutral-900`}
                        />
                        <span className={`font-medium`}>
                            {website.localize({
                                en: 'Templates',
                                fr: 'Modèles',
                            })}
                        </span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <LiaExternalLinkSquareAltSolid
                            onClick={() => {
                                window.open(iframeSrc, '_blank');
                            }}
                            className={`w-6 h-6 text-neutral-700 hover:text-neutral-900 cursor-pointer`}
                        />
                        <TbDeviceMobile
                            onClick={() => {
                                if (screen === 'mobile') setScreen('desktop');
                                else setScreen('mobile');
                            }}
                            className={`w-[22px] h-[22px] cursor-pointer ${
                                screen === 'mobile' ? 'text-secondary-500' : 'text-neutral-700'
                            } hover:${
                                screen === 'mobile' ? 'text-secondary-700' : 'text-neutral-900'
                            }`}
                        />
                    </div>
                </div>
            </div>
            <div className={`flex flex-col px-4 py-3 flex-1`}>
                <h2 className={`text-lg font-bold`}>{name}</h2>
                {description ? (
                    <div
                        className={
                            `text-neutral-600 mt-3 max-h-[300px] overflow-y-auto text-[13px] break-words leading-[140%] flex flex-col space-y-3` +
                            ` ${Styles.Scrollbar}`
                        }
                    >
                        <SafeHtml value={description} makeLinksExternal={true} />
                    </div>
                ) : null}
                <LibrarySection {...props} info={info}></LibrarySection>
                <div className={`w-full mt-auto mb-[120px] justify-center flex`}>
                    <div
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
                        className={`flex items-center px-16 rounded-lg h-12 text-neutral-50 hover:text-neutral-50 bg-neutral-950 hover:bg-neutral-900 cursor-pointer`}
                        style={{ width: 'fit-content' }}
                    >
                        <p className={`font-medium text-base tracking-wide`}>
                            {website.localize({
                                en: 'Use This Template',
                                fr: 'Utiliser ce modèle',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
