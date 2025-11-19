import React, { useEffect, useState } from 'react';
import { twJoin, useGetProfile, Profile } from '@uniwebcms/module-sdk';
import { Image, MediaIcon } from '@uniwebcms/core-components';
import { getPreferredPhone, formatPhone, normalizePhone } from '../_utils/phone';
import { LuMail, LuPhone, LuMic } from 'react-icons/lu';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import client from '../_utils/ajax';

export default function ExpertProfile(props) {
    const { block, website } = props;

    const { layout = 'wide_banner', show_media_request_form = true } = block.getBlockProperties();

    const { useLocation } = website.getRoutingComponents();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const id = params.get('id') || '';

    if (!id) {
        console.log('failed to get expert id');
        return null;
    }

    // useEffect(() => {
    //     const params = new URLSearchParams(location.search);

    //     setId(params.get('id'));
    // }, [location.search]);

    return <Layout layout={layout} id={id} website={website} showForm={show_media_request_form} />;
}

const Layout = ({ id, website, layout, showForm }) => {
    const { data: response = {}, error } = uniweb.useCompleteQuery(`getExpert_${id}`, async () => {
        const response = await client.get('experts.php', {
            params: {
                action: 'getExpert',
                siteId: website.getSiteId(),
                memberId: id,
                lang: website.getLanguage(),
            },
        });
        return response.data;
    });

    if (error) {
        console.log('error when fetch expert data', error);
        return null;
    }

    const { data, experts } = response;

    if (layout === 'wide_banner') {
        return <WideBanner data={data} id={id} website={website} showForm={showForm} />;
    }
    if (layout === 'sidebar_left') {
        return <SidebarLeft data={data} id={id} website={website} showForm={showForm} />;
    }
    if (layout === 'sidebar_right') {
        return <SidebarRight data={data} id={id} website={website} showForm={showForm} />;
    }
};

const WideBanner = ({ data, id, website, showForm }) => {
    if (!data) {
        return (
            <div>
                <div className="h-48 md:h-64 lg:h-80">
                    <div className="w-full h-full bg-gray-300 rounded-[var(--border-radius)] animate-pulse"></div>
                </div>
                <div className="mt-8">
                    <div className="animate-pulse">
                        <div className="h-9 bg-gray-300 rounded-[var(--border-radius)] w-60"></div>
                        <div className="h-7 bg-gray-300 rounded-[var(--border-radius)] w-72 mt-2"></div>
                        <div className="h-7 bg-gray-300 rounded-[var(--border-radius)] w-60 mt-2"></div>
                    </div>
                </div>
                <hr className="my-8 border-text-color/20" />
            </div>
        );
    }

    const expert = new Profile('members', id, { data });

    const { head, title } = expert.getBasicInfo();

    const unit = head.academic_unit?.[1];
    const department = head.academic_unit?.[2];
    const university = head.academic_unit?.[3];
    const position = head.position_title?.[1];

    return (
        <div>
            <Banner profile={expert} className="h-48 md:h-64 lg:h-80" />
            <div className="mt-8">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="mt-2 text-xl font-medium text-primary-800">
                    {position && <span>{position}</span>}
                    {position && unit ? ', ' : ''}
                    {unit && <span>{unit}</span>}
                </p>
                <p className="mt-1 text-lg">{department}</p>
                <p className="mt-1 text-lg text-text-color/70">{university}</p>
            </div>
            <hr className="my-8 border-text-color/20" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                <div className="lg:col-span-2">{/* Render profile content */}</div>
                <div className="lg:col-span-1 lg:sticky lg:top-8 self-start">
                    <MediaInquiriesBox profile={expert} website={website} showForm={showForm} />
                </div>
            </div>
        </div>
    );
};

const SidebarLeft = ({ data, id, website, showForm }) => {
    if (!data) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                <div className="lg:col-span-1 lg:sticky lg:top-8 self-start">
                    <div className="w-full aspect-square bg-gray-300 rounded-[var(--border-radius)] animate-pulse"></div>
                </div>
                <div className="lg:col-span-2">
                    <div className="animate-pulse">
                        <div className="h-9 bg-gray-300 rounded-[var(--border-radius)] w-60"></div>
                        <div className="h-7 bg-gray-300 rounded-[var(--border-radius)] w-72 mt-2"></div>
                        <div className="h-7 bg-gray-300 rounded-[var(--border-radius)] w-60 mt-2"></div>
                    </div>
                    <hr className="my-8 border-text-color/20" />
                </div>
            </div>
        );
    }

    const expert = new Profile('members', id, { data });

    const { head, title } = expert.getBasicInfo();

    const unit = head.academic_unit?.[1];
    const department = head.academic_unit?.[2];
    const university = head.academic_unit?.[3];
    const position = head.position_title?.[1];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-1 lg:sticky lg:top-8 self-start">
                <Banner profile={expert} className="aspect-square" />
                <div className="mt-6">
                    <MediaInquiriesBox profile={expert} website={website} showForm={showForm} />
                </div>
            </div>
            <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="mt-2 text-xl font-medium text-primary-800">
                    {position && <span>{position}</span>}
                    {position && unit ? ', ' : ''}
                    {unit && <span>{unit}</span>}
                </p>
                <p className="mt-1 text-lg">{department}</p>
                <p className="mt-1 text-lg text-text-color/70">{university}</p>
                <hr className="my-8 border-text-color/20" />
                {/* Render profile content */}
            </div>
        </div>
    );
};

const SidebarRight = ({ data, id, website, showForm }) => {
    if (!data) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                <div className="lg:col-span-2 lg:order-1">
                    <div className="animate-pulse">
                        <div className="h-9 bg-gray-300 rounded-[var(--border-radius)] w-60"></div>
                        <div className="h-7 bg-gray-300 rounded-[var(--border-radius)] w-72 mt-2"></div>
                        <div className="h-7 bg-gray-300 rounded-[var(--border-radius)] w-60 mt-2"></div>
                    </div>
                    <hr className="my-8 border-text-color/20" />
                </div>
                <div className="lg:col-span-1 lg:order-2 lg:sticky lg:top-8 self-start">
                    <div className="w-full aspect-square bg-gray-300 rounded-[var(--border-radius)] animate-pulse"></div>
                </div>
            </div>
        );
    }

    const expert = new Profile('members', id, { data });

    const { head, title } = expert.getBasicInfo();

    const unit = head.academic_unit?.[1];
    const department = head.academic_unit?.[2];
    const university = head.academic_unit?.[3];
    const position = head.position_title?.[1];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2 lg:order-1">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="mt-2 text-xl font-medium text-primary-800">
                    {position && <span>{position}</span>}
                    {position && unit ? ', ' : ''}
                    {unit && <span>{unit}</span>}
                </p>
                <p className="mt-1 text-lg">{department}</p>
                <p className="mt-1 text-lg text-text-color/70">{university}</p>
                <hr className="my-8 border-text-color/20" />
                {/* Render profile content */}
            </div>
            <div className="lg:col-span-1 lg:order-2 lg:sticky lg:top-8 self-start">
                <Banner profile={expert} className="aspect-square" />
                <div className="mt-6">
                    <MediaInquiriesBox profile={expert} website={website} showForm={showForm} />
                </div>
            </div>
        </div>
    );
};

const Banner = ({ profile, className = '' }) => {
    return (
        <Image
            profile={profile}
            type="banner"
            className={twJoin(
                'w-full object-cover shadow rounded-[var(--border-radius)] border border-text-color/20',
                className
            )}
        />
    );
};

const joinWithComma = (a, b) => [a, b].filter(Boolean).join(', ');

const MediaInquiriesBox = ({ profile, website, showForm }) => {
    const { title, head } = profile.getBasicInfo();
    const { email, telephone, office } = head || {};
    const contactPreferences = profile.at('contact_preferences');
    const { language, others: otherLanguages } = profile.at('language_proficiency');
    const socialMediaLinks = (
        Profile.parseAsDisplayData(profile.rawData, website)['social_media_links']?.value || []
    ).map((l) => Profile.parseMediaLinkValue(l));

    const languageMapping = {
        english: website.localize({
            en: 'English',
            fr: 'Anglais',
        }),
        french: website.localize({
            en: 'French',
            fr: 'Français',
        }),
        bilingual: website.localize({
            en: 'Bilingual',
            fr: 'Bilingue',
        }),
    };

    let contactEmail, contactTelephone, contactOffice, interviewLanguages;

    contactEmail = contactPreferences?.email === '1' && email ? email : null;
    contactTelephone = contactPreferences?.telephone === '1' ? telephone : null;
    contactOffice = contactPreferences?.office === '1' && office ? office : null;
    interviewLanguages = joinWithComma(languageMapping[language] || language, otherLanguages);

    return (
        <div>
            <div className="p-6 bg-text-color-0 shadow border border-text-color/20 rounded-[var(--border-radius)]">
                <p className="text-lg font-bold">
                    {website.localize({
                        en: 'For Media Inquiries',
                        fr: 'Pour les demandes des médias',
                    })}
                </p>

                <div className="mt-4 p-3 bg-text-color/5 rounded-[var(--border-radius)] border border-text-color/20">
                    <p className="font-semibold text-heading-color/80">
                        {website.localize({
                            en: 'Availability',
                            fr: 'Disponibilité',
                        })}
                    </p>
                    <p className="mt-1 text-sm">
                        Available for short-notice breaking news. Prefers morning interviews.
                    </p>
                </div>

                <div className="mt-4 text-sm">
                    {showForm
                        ? website.localize({
                              en: `Please contact the Media Relations team for interview requests, or you can contact ${title} directly:`,
                              fr: `Veuillez contacter l’équipe des relations avec les médias pour les demandes d’interview, ou vous pouvez contacter directement ${title} :`,
                          })
                        : website.localize({
                              en: `Please contact ${title} directly:`,
                              fr: `Veuillez contacter directement ${title} :`,
                          })}
                </div>

                <ul className="mt-4 space-y-3">
                    {contactEmail && (
                        <li className="flex items-center gap-3">
                            <LuMail className="h-5 w-5" />
                            <a
                                href={`mailto:${contactEmail}`}
                                className="text-sm hover:underline break-all"
                            >
                                {contactEmail}
                            </a>
                        </li>
                    )}
                    {contactTelephone && (
                        <li className="flex items-center gap-3">
                            <LuPhone className="h-5 w-5" />
                            {normalizePhone(contactTelephone) ? (
                                <a
                                    href={`tel:${normalizePhone(contactTelephone)}`}
                                    className="text-sm hover:underline"
                                >
                                    {formatPhone(contactTelephone)}
                                </a>
                            ) : (
                                <span className="text-sm">{contactTelephone}</span>
                            )}
                        </li>
                    )}
                    {contactOffice && (
                        <li className="flex items-center gap-3">
                            <HiOutlineOfficeBuilding className="h-5 w-5" />
                            {normalizePhone(contactOffice) ? (
                                <a
                                    href={`tel:${normalizePhone(contactOffice)}`}
                                    className="text-sm hover:underline"
                                >
                                    {formatPhone(contactOffice)}
                                </a>
                            ) : (
                                <span className="text-sm">{contactOffice}</span>
                            )}
                        </li>
                    )}
                    {interviewLanguages && (
                        <li className="flex items-center gap-3">
                            <LuMic className="h-5 w-5" />
                            <span className="text-sm">
                                {website.localize({
                                    en: 'Interviews in: ',
                                    fr: 'Interviews en : ',
                                })}
                                <span className="font-medium">{interviewLanguages}</span>
                            </span>
                        </li>
                    )}
                </ul>
                {showForm ? (
                    <>
                        <MediaQuest website={website} />
                        <DirectContact contactEmail={contactEmail} website={website} />
                    </>
                ) : (
                    <DirectContact contactEmail={contactEmail} isPrimary={true} website={website} />
                )}
            </div>
            {socialMediaLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap">
                    {socialMediaLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mr-2 mb-2"
                            title={link.label}
                        >
                            <MediaIcon
                                type={link.type}
                                size={7}
                                className="text-icon-color/70 hover:text-icon-color"
                            />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

const MediaQuest = ({ website }) => {
    const { useNavigate } = website.getRoutingComponents();
    const navigate = useNavigate();

    const handleClick = () => {
        // add a extra path to end of the URL
        const url = new URL(window.location.href);
        url.pathname += '/request';

        navigate(`${url.pathname}${url.search}`);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btn-color w-full mt-6 rounded-[var(--border-radius)]"
        >
            {website.localize({
                en: 'Send Media Request',
                fr: 'Envoyer une demande de médias',
            })}
        </button>
    );
};

const DirectContact = ({ contactEmail, isPrimary = false, website }) => {
    const to = `mailto:${contactEmail}`;

    if (isPrimary) {
        return (
            <a
                href={to}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold transition-all bg-btn-color text-btn-text-color hover:bg-btn-hover-color hover:text-btn-hover-text-color focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btn-color w-full mt-6 rounded-[var(--border-radius)]"
            >
                {contactEmail && <LuMail className="h-5 w-5 text-inherit" />}
                {website.localize({
                    en: 'Contact directly',
                    fr: 'Contactez directement',
                })}
            </a>
        );
    }

    return (
        <p className="mt-3 text-center text-sm">
            <a href={to} className="hover:underline">
                {website.localize({
                    en: 'Or, contact directly',
                    fr: 'Ou, contactez directement',
                })}
            </a>
        </p>
    );
};
