import React, { useState } from 'react';
import Container from '../_utils/Container';
import { MediaIcon } from '@uniwebcms/module-sdk';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import MoonLoader from 'react-spinners/MoonLoader';

function Newsletter({ website, title }) {
    const siteId = website.getSiteId();

    const [email, setEmail] = useState('');
    const [buttonIcon, setButtonIcon] = useState(null);

    const handleOnSubmit = (e) => {
        e.preventDefault();

        setButtonIcon(<MoonLoader size='16px' color='var(--neutral-600)' aria-label='Updating'></MoonLoader>);

        setTimeout(() => {
            website.submitWebsiteForm(siteId, 'newsletter', { email }).then((res) => {
                setEmail('');

                setButtonIcon(<AiOutlineCheckCircle className='h-5 w-5' />);

                setTimeout(() => {
                    setButtonIcon(null);
                }, 2000);
            });
        }, 500);
    };

    return (
        <div className='space-y-2.5 md:space-y-4 lg:space-y-6 flex-grow'>
            <h3 className='text-lg font-medium md:text-xl lg:text-2xl'>{title}</h3>
            <form onSubmit={handleOnSubmit} className='flex h-10'>
                <input
                    type='email'
                    placeholder={website.localize({
                        en: 'Email address',
                        fr: 'Adresse électronique'
                    })}
                    aria-label='Email address'
                    required
                    className='min-w-0 w-64 appearance-none rounded-md bg-text-color-20 focus-within:bg-text-color-0 px-3 py-2 shadow-md placeholder:text-text-color-80 ring-0 focus:outline-none sm:text-sm text-text-color border border-text-color-50'
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value || '');
                    }}
                />
                <button
                    type='submit'
                    className='flex-none ml-4 flex items-center justify-center h-full w-28 rounded-md text-[15px] shadow-md bg-text-color-20 hover:bg-text-color-10'>
                    <span className='flex text-text-color'>
                        {buttonIcon || website.localize({ en: 'Subscribe', fr: "S'abonner" })}
                    </span>
                </button>
            </form>
        </div>
    );
}

const MediaLinks = ({ profile, title }) => {
    const links = profile.getSocialMediaLinks('social_media_links');

    return (
        <div className='space-y-2.5 md:space-y-4 lg:space-y-6 flex-grow'>
            <h3 className='text-lg font-medium md:text-xl lg:text-2xl'>{title}</h3>
            <div className='flex items-center space-x-4'>
                {links.map((link, index) => {
                    const { type, url, name, label } = link;

                    return (
                        <a key={index} href={url} target='_blank' title={label || name}>
                            <MediaIcon type={type} className='w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8' />
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default function SocialConnector(props) {
    const { block, website, input } = props;

    const { mainHeader } = block;
    const { title, subtitle } = mainHeader;

    const profile = input?.profile;

    if (!profile) return null;

    const newsletterTitle =
        title || website.localize({ en: 'Subscribe for updates', fr: "S'abonner à ma lettre d'information" });

    const mediaLinksTitle = subtitle || website.localize({ en: 'Follow us', fr: 'Suivez-nous' });

    return (
        <Container>
            <div className='px-6 mx-auto max-w-7xl lg:px-8 flex flex-col md:flex-row items-start justify-between md:space-x-6 space-y-8 md:space-y-0'>
                <Newsletter title={newsletterTitle} website={website} />
                <MediaLinks title={mediaLinksTitle} profile={profile} />
            </div>
        </Container>
    );
}
