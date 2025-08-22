import React, { useState } from 'react';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { Image, SafeHtml } from '@uniwebcms/core-components';
import { FaQuoteLeft } from 'react-icons/fa';

const Testimonial = (info) => {
    const { title: name, subtitle: role, paragraphs: statement, images } = info;
    const photo = images[0] || null;

    return (
        <div className="w-full lg:w-1/2 bg-neutral-50 p-6 rounded-lg shadow-md">
            <FaQuoteLeft className="w-6 h-6 lg:w-8 lg:h-8 text-text-color" />
            <SafeHtml
                value={statement}
                className="text-xl md:text-2xl lg:text-3xl xl:text-4xl my-6"
            />
            <div className="flex items-center gap-4">
                {photo && (
                    <Image
                        profile={getPageProfile()}
                        {...photo}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                )}
                <div>
                    <div>{name}</div>
                    <div className="text-sm text-neutral-600">{role}</div>
                </div>
            </div>
        </div>
    );
};

export default function Newsletter(props) {
    const { block, website } = props;
    const { title, subtitle, buttons } = block.getBlockContent();
    const testimonial = block.getBlockItems()[0] || null;
    const btnText =
        buttons[0]?.content ||
        website.localize({
            en: 'Subscribe',
            fr: "S'abonner",
            zh: '订阅',
            es: 'Suscribirse',
        });

    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        website.submitWebsiteForm('newsletter', { email }).then((res) => {
            alert(
                website.localize({
                    en: 'Thank you for your interest.',
                    fr: 'Merci pour votre intérêt.',
                })
            );
        });
    };

    return (
        <div className="py-16 px-5">
            <div
                className={twJoin(
                    'flex flex-col gap-y-8 gap-x-16 xl:gap-x-20 max-w-[1200px] mx-auto',
                    testimonial ? 'lg:flex-row lg:justify-between lg:items-center' : 'items-center'
                )}
            >
                {/* Left: Newsletter Form */}
                <div
                    className={twJoin('w-full', testimonial ? 'lg:w-1/2' : 'max-w-lg text-center')}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4">{title}</h2>
                    <p className="text-lg lg:text-xl mb-6">{subtitle}</p>
                    <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-sm"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-md transition bg-btn-color text-btn-text-color hover:bg-btn-hover-color hover:text-btn-hover-text-color"
                        >
                            {btnText}
                        </button>
                    </form>
                </div>

                {/* Right: Testimonial */}
                {testimonial && <Testimonial {...testimonial} />}
            </div>
        </div>
    );
}
