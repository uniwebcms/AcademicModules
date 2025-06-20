import React, { useState } from 'react';
import Container from '../_utils/Container';
import { MediaIcon, Link } from '@uniwebcms/core-components';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import MoonLoader from 'react-spinners/MoonLoader';
import { getMediaLinkType } from '../_utils/media';

function Newsletter({ website, title }) {
    const siteId = website.getSiteId();

    const [email, setEmail] = useState('');
    const [buttonIcon, setButtonIcon] = useState(null);

    const handleOnSubmit = (e) => {
        e.preventDefault();

        setButtonIcon(
            <MoonLoader size="16px" color="var(--neutral-600)" aria-label="Updating"></MoonLoader>
        );

        setTimeout(() => {
            website.submitWebsiteForm(siteId, 'newsletter', { email }).then((res) => {
                setEmail('');

                setButtonIcon(<AiOutlineCheckCircle className="h-5 w-5" />);

                setTimeout(() => {
                    setButtonIcon(null);
                }, 2000);
            });
        }, 500);
    };

    return (
        <div className="space-y-2.5 md:space-y-4 lg:space-y-6 flex-grow">
            <h3 className="text-lg font-medium md:text-xl lg:text-2xl">{title}</h3>
            <form onSubmit={handleOnSubmit} className="flex h-10">
                <input
                    type="email"
                    placeholder={website.localize({
                        en: 'Email address',
                        fr: 'Adresse électronique',
                    })}
                    aria-label="Email address"
                    required
                    className="min-w-0 w-64 appearance-none rounded-md bg-transparent focus-within:border-text-color-50 px-3 py-2 shadow-md placeholder:text-text-color-50 ring-0 focus:outline-none sm:text-sm text-text-color border border-text-color-20"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value || '');
                    }}
                />
                <button
                    type="submit"
                    className="flex-none ml-4 flex items-center justify-center h-full w-28 rounded-md text-[15px] shadow-md border border-text-color-20 bg-text-color-10 hover:bg-text-color hover:text-text-color-0"
                >
                    <span className="flex">
                        {buttonIcon || website.localize({ en: 'Subscribe', fr: "S'abonner" })}
                    </span>
                </button>
            </form>
        </div>
    );
}

const MediaLinks = ({ links, title }) => {
    return (
        <div className="space-y-2.5 md:space-y-4 lg:space-y-6 flex-grow">
            <h3 className="text-lg font-medium md:text-xl lg:text-2xl">{title}</h3>
            <div className="flex items-center space-x-4">
                {links.map((link, index) => {
                    const type = getMediaLinkType(link);

                    return (
                        <Link key={index} to={link.href} target="_blank">
                            <MediaIcon
                                type={type}
                                className="w-6 h-6 md:w-7 md:h-7 hover:scale-105 transition-transform duration-150"
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default function SocialConnector(props) {
    const { block, website } = props;

    const { title, subtitle, links } = block.getBlockContent();

    const newsletterTitle =
        title ||
        website.localize({
            en: 'Subscribe for updates',
            fr: "S'abonner à ma lettre d'information",
        });

    const mediaLinksTitle = subtitle || website.localize({ en: 'Follow us', fr: 'Suivez-nous' });

    const { vertical_padding = 'lg' } = block.getBlockProperties();

    let py = '';

    if (vertical_padding === 'none') {
        py = 'py-0 lg:py-0';
    } else if (vertical_padding === 'sm') {
        py = 'py-6 lg:py-12';
    } else if (vertical_padding === 'md') {
        py = 'py-8 lg:py-16';
    } else if (vertical_padding === 'lg') {
        py = 'py-12 lg:py-24';
    }

    return (
        <Container py={py}>
            <div className="px-6 mx-auto max-w-7xl lg:px-8 flex flex-col md:flex-row items-start justify-between md:space-x-6 space-y-8 md:space-y-0">
                <Newsletter title={newsletterTitle} website={website} />
                <MediaLinks title={mediaLinksTitle} links={links} />
            </div>
        </Container>
    );
}
