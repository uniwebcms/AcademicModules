import React, { useEffect, useState } from 'react';
import { twJoin, useGetProfile } from '@uniwebcms/module-sdk';
import { Image } from '@uniwebcms/core-components';
import { getPreferredPhone, formatPhone } from '../_utils/phone';
import { LuMail, LuPhone, LuMic } from 'react-icons/lu';

export default function ExpertProfile(props) {
    const { block, website } = props;

    const { layout = 'wide_banner' } = block.getBlockProperties();

    const { useLocation } = website.getRoutingComponents();
    const location = useLocation();

    const [id, setId] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        setId(params.get('id'));
    }, [location.search]);

    return <Layout layout={layout} id={id} website={website} />;
}

const Layout = ({ layout, ...props }) => {
    if (layout === 'wide_banner') {
        return <WideBanner {...props} />;
    }
    if (layout === 'sidebar_left') {
        return <SidebarLeft {...props} />;
    }
    if (layout === 'sidebar_right') {
        return <SidebarRight {...props} />;
    }
};

const WideBanner = ({ id }) => {
    const { profile: expert } = useGetProfile('members', id);

    if (!expert || !expert.isReady()) {
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

    const { head, title } = expert.getBasicInfo();

    const unit = head.academic_unit?.[1];
    const department = head.academic_unit?.[2];
    const position = head.position_title?.[1];

    return (
        <div>
            <Banner profile={expert} className="h-48 md:h-64 lg:h-80" />
            <div className="mt-8">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="mt-2 text-xl font-medium text-primary-700">
                    {position && <span>{position}</span>}
                    {position && unit ? ', ' : ''}
                    {unit && <span>{unit}</span>}
                </p>
                <p className="mt-1 text-lg">{department}</p>
            </div>
            <hr className="my-8 border-text-color/20" />
            {/* Render profile content and media inquiries box */}
        </div>
    );
};

const SidebarLeft = ({ id }) => {
    const { profile: expert } = useGetProfile('members', id);

    if (!expert || !expert.isReady()) {
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

    const { head, title } = expert.getBasicInfo();

    const unit = head.academic_unit?.[1];
    const department = head.academic_unit?.[2];
    const position = head.position_title?.[1];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-1 lg:sticky lg:top-8 self-start">
                <Banner profile={expert} className="aspect-square" />
            </div>
            <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="mt-2 text-xl font-medium text-primary-700">
                    {position && <span>{position}</span>}
                    {position && unit ? ', ' : ''}
                    {unit && <span>{unit}</span>}
                </p>
                <p className="mt-1 text-lg">{department}</p>
                <hr className="my-8 border-text-color/20" />
                {/* Render profile content and media inquiries box */}
            </div>
        </div>
    );
};

const SidebarRight = ({ id, website }) => {
    const { profile: expert } = useGetProfile('members', id);

    if (!expert || !expert.isReady()) {
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

    const { head, title } = expert.getBasicInfo();

    const unit = head.academic_unit?.[1];
    const department = head.academic_unit?.[2];
    const position = head.position_title?.[1];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2 lg:order-1">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="mt-2 text-xl font-medium text-primary-700">
                    {position && <span>{position}</span>}
                    {position && unit ? ', ' : ''}
                    {unit && <span>{unit}</span>}
                </p>
                <p className="mt-1 text-lg">{department}</p>
                <hr className="my-8 border-text-color/20" />
                {/* Render profile content and media inquiries box */}
            </div>
            <div className="lg:col-span-1 lg:order-2 lg:sticky lg:top-8 self-start">
                <Banner profile={expert} className="aspect-square" />
                <div className="mt-6">
                    <MediaInquiriesBox profile={expert} website={website} />
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

const MediaInquiriesBox = ({ profile, website }) => {
    const { title, head } = profile.getBasicInfo();
    const { email, telephone, office } = head || {};
    // const {
    //     email: emailContact = '0',
    //     telephone: telephoneContact = '0',
    //     office: officeContact = '0',
    // } = profile.at('contact_preferences') || {};
    const contactPreferences = profile.at('contact_preferences');
    const { language, others: otherLanguages } = profile.at('language_proficiency');
    // office is to show the contact form

    let contactEmail, contactTelephone, interviewLanguages, contactMethod;

    contactEmail = email;
    contactTelephone = getPreferredPhone(telephone, office);
    interviewLanguages = joinWithComma(language, otherLanguages);

    const hasDirectContact =
        (contactPreferences?.email === '1' && contactEmail) ||
        (contactPreferences?.telephone === '1' && contactTelephone);

    if (contactPreferences?.office === '0') {
        if (hasDirectContact) {
            contactMethod = 'direct';
        }
    } else {
        if (hasDirectContact) {
            contactMethod = 'hybrid';
        } else {
            contactMethod = 'form';
        }
    }

    return (
        <div className="p-6 bg-text-color-0 shadow border border-text-color/20 rounded-[var(--border-radius)]">
            <h2 className="text-lg font-bold">
                {website.localize({
                    en: 'For Media Inquiries',
                    fr: 'Pour les demandes des médias',
                })}
            </h2>

            <div className="mt-4 p-3 bg-text-color/5 rounded-[var(--border-radius)] border border-text-color/20">
                <h3 className="font-semibold text-heading-color/80">
                    {website.localize({
                        en: 'Availability',
                        fr: 'Disponibilité',
                    })}
                </h3>
                <p className="mt-1 text-sm">
                    Available for short-notice breaking news. Prefers morning interviews.
                </p>
            </div>

            <div className="mt-4 text-sm">
                {contactMethod === 'direct' &&
                    website.localize({
                        en: `Contact ${title} directly:`,
                        fr: `Contactez directement ${title} :`,
                    })}
                {contactMethod === 'form' &&
                    website.localize({
                        en: 'Please contact the Media Relations team for interview requests.',
                        fr: 'Veuillez contacter l’équipe des relations avec les médias pour les demandes d’interview.',
                    })}
                {contactMethod === 'hybrid' &&
                    website.localize({
                        en: `Please contact the Media Relations team for interview requests, or you can contact ${title} directly:`,
                        fr: `Veuillez contacter l’équipe des relations avec les médias pour les demandes d’interview, ou vous pouvez contacter directement ${title} :`,
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
                        <a href={`tel:${contactTelephone}`} className="text-sm hover:underline">
                            {formatPhone(contactTelephone)}
                        </a>
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
            {contactMethod === 'direct' && (
                <DirectContact
                    contactEmail={contactEmail}
                    contactTelephone={contactTelephone}
                    isPrimary={true}
                    website={website}
                />
            )}
            {contactMethod === 'form' && <MediaQuest website={website} />}
            {contactMethod === 'hybrid' && (
                <>
                    <MediaQuest website={website} />
                    <DirectContact
                        contactEmail={contactEmail}
                        contactTelephone={contactTelephone}
                        website={website}
                    />
                </>
            )}
        </div>
    );
};

const MediaQuest = ({ website }) => {
    const { useNavigate, useLocation } = website.getRoutingComponents();
    const navigate = useNavigate();
    const location = useLocation();

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

const DirectContact = ({ contactEmail, contactTelephone, isPrimary = false, website }) => {
    const to = contactEmail
        ? `mailto:${contactEmail}`
        : contactTelephone
        ? `tel:${contactTelephone}`
        : '#';

    if (isPrimary) {
        return (
            <a
                href={to}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold transition-all bg-btn-color text-btn-color hover:bg-btn-hover-color hover:text-btn-hover-text-color focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btn-color w-full mt-6 rounded-[var(--border-radius)]"
            >
                {contactEmail && <LuMail className="h-5 w-5 text-inherit" />}
                {contactTelephone && <LuPhone className="h-5 w-5 text-inherit" />}
                {website.localize({
                    en: 'Contact Directly',
                    fr: 'Contactez directement',
                })}
            </a>
        );
    }

    return (
        <p className="mt-3 text-center text-sm">
            <a href={to} className="hover:underline">
                {website.localize({
                    en: 'Or, contact Directly',
                    fr: 'Or, contactez directement',
                })}
            </a>
        </p>
    );
};
