import React, { useRef } from 'react';
import { SafeHtml, stripTags } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';
import { MdEmail } from 'react-icons/md';

export default function NewsletterForm({ block, website }) {
    const { title = '', subtitle = '' } = block.main?.header || {};

    const paragraphs = block.main.body?.paragraphs;

    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        const email = inputRef.current.value;

        // Prevent the default form submit action
        e.preventDefault();

        // Custom submission logic
        website.submitWebsiteForm('newsletter', { email }).then((res) => {
            alert(
                website.localize({
                    en: 'Thank you for your interest.',
                    fr: 'Merci pour votre intérêt.'
                })
            );
        });
    };

    return (
        <Container as='aside' className='py-10 sm:py-16 lg:py-20 px-6 md:px-8'>
            <h2 className='mb-4 text-2xl md:text-4xl font-bold tracking-tight md:font-extrabold lg:leading-none md:text-center'>
                {stripTags(title)}
            </h2>
            <p className='mb-4 text-base md:mb-7 md:text-center md:text-xl lg:px-20 xl:px-56 text-text-color-80'>
                {stripTags(subtitle)}
            </p>
            <div className='mb-4'>
                <form className='flex max-w-xl md:mx-auto' onSubmit={handleSubmit}>
                    <div className='w-full'>
                        <label htmlFor='email-address' className='sr-only'>
                            Email address
                        </label>
                        <div className='relative h-full'>
                            <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
                                <MdEmail className='w-4 h-4 text-text-color-90' />
                            </div>
                            <input
                                ref={inputRef}
                                id='email-address'
                                name='email-address'
                                type='email'
                                autoComplete='email'
                                required
                                className='block w-full pr-3 py-2 pl-10 lg:pr-3 lg:py-4 lg:pl-11 text-base bg-text-color-0 placeholder:text-text-color-50 border border-text-color-20 rounded-l-xl focus:ring-2 focus:ring-inset focus:ring-indigo-600'
                                placeholder={website.localize({
                                    en: 'Enter your email',
                                    fr: 'Entrez votre adresse e-mail'
                                })}
                            />
                        </div>
                    </div>
                    <div>
                        <input
                            type='submit'
                            className='w-full p-2 lg:p-4 text-base font-medium text-center text-primary-800 bg-primary-300 border border-primary-300 cursor-pointer rounded-r-xl hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-indigo-600'
                            value={website.localize({
                                en: 'Subscribe',
                                fr: 'Souscrire'
                            })}></input>
                    </div>
                </form>
            </div>
            <SafeHtml value={paragraphs} className='text-md md:text-center font-normal text-text-color-90' />
        </Container>
    );
}
