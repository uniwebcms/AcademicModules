import React from 'react';
import { twJoin, stripTags } from '@uniwebcms/module-sdk';
import { HiPhone } from 'react-icons/hi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { SlEnvolope } from 'react-icons/sl';
import Container from '../_utils/Container';

export default function ContactForm({ block, website }) {
    const { main } = block;

    const { title = '', subtitle = '' } = main.header || {};

    const { form_align = 'left' } = block.getBlockProperties();

    const phoneNumberRegex =
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

    const phoneNumbers =
        main.body?.paragraphs?.filter((element) => element.match(phoneNumberRegex)) || [];
    const emails = main.body?.links?.filter((element) => element.label.match(emailRegex)) || [];
    const addresses =
        main.body?.paragraphs?.filter((element) => !element.match(phoneNumberRegex)) || [];

    const right_align = form_align === 'right';

    return (
        <Container>
            <div
                className={twJoin(
                    'mx-auto max-w-7xl flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-6 xl:gap-x-12 lg:gap-y-0',
                    !right_align ? 'flex-col-reverse' : 'space-y-12 lg:space-y-0'
                )}
            >
                {!right_align ? <Form website={website} /> : null}
                <div
                    className={twJoin(
                        'relative px-6 lg:static lg:px-8',
                        !right_align ? 'mb-12 lg:mb-0' : ''
                    )}
                >
                    <div className="max-w-full mx-auto lg:mx-0 lg:max-w-lg px-6 lg:px-0">
                        <h2 className="text-3xl font-bold tracking-tight  md:text-4xl ld:text-5xl">
                            {stripTags(title)}
                        </h2>
                        {subtitle && (
                            <h3 className="mt-4 text-base leading-8 md:text-lg ld:text-xl text-text-color-80">
                                {stripTags(subtitle)}
                            </h3>
                        )}
                        <dl className="mt-10 space-y-4 text-base leading-7">
                            {addresses.length ? (
                                <div className="flex gap-x-4">
                                    <dt className="flex-none">
                                        <span className="sr-only">Address</span>
                                        <HiOutlineBuildingOffice2
                                            className="w-6 h-7"
                                            aria-hidden="true"
                                        />
                                    </dt>
                                    <div className="flex flex-col">
                                        {addresses.map((address, index) => {
                                            return (
                                                <dd key={index} className="block">
                                                    {stripTags(address)}
                                                </dd>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : null}
                            {phoneNumbers.length ? (
                                <div className="flex gap-x-4">
                                    <dt className="flex-none">
                                        <span className="sr-only">Telephone</span>
                                        <HiPhone className="w-6 h-7" aria-hidden="true" />
                                    </dt>
                                    <div className="flex flex-col">
                                        {phoneNumbers.map((phoneNumber, index) => {
                                            return (
                                                <dd className="block" key={index}>
                                                    <a
                                                        href={`tel:${phoneNumber}`}
                                                        className="hover:underline"
                                                    >
                                                        {stripTags(phoneNumber)}
                                                    </a>
                                                </dd>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : null}
                            {emails.length ? (
                                <div className="flex gap-x-4">
                                    <dt className="flex-none">
                                        <span className="sr-only">Email</span>
                                        <SlEnvolope className="w-6 h-7" aria-hidden="true" />
                                    </dt>
                                    <div className="flex flex-col">
                                        {emails.map((email, index) => (
                                            <dd key={index}>
                                                <a
                                                    href={`mailto:${email.href}`}
                                                    className="hover:underline"
                                                >
                                                    {email.label}
                                                </a>
                                            </dd>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </dl>
                    </div>
                </div>
                {right_align && <Form website={website} />}
            </div>
        </Container>
    );
}

const Form = (props) => {
    const { website } = props;

    return (
        <form
            action="#"
            method="POST"
            className="px-6 lg:px-8"
            onSubmit={(event) => {
                event.preventDefault();

                // get email
                const email = event.target.email.value;
                // get first name
                const firstName = event.target['first-name'].value;
                // get last name
                const lastName = event.target['last-name'].value;
                // get phone number
                const phoneNumber = event.target['phone-number'].value;
                // get message
                const message = event.target.message.value;

                website
                    .submitWebsiteForm('contact', {
                        email,
                        firstName,
                        lastName,
                        phoneNumber,
                        message,
                    })
                    .then((res) => {
                        alert(
                            website.localize({
                                en: 'Thank you for contacting us.',
                                es: 'Gracias por contactarnos.',
                            })
                        );

                        event.target.reset();
                    });
            }}
        >
            <div className="max-w-full mx-auto lg:mr-0 lg:max-w-lg px-6 lg:px-0">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="first-name"
                            className="block text-sm font-semibold leading-6 "
                        >
                            {website.localize({ en: 'First name', es: 'Nombre' })}
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                className="block w-full rounded-md border-0 px-3.5 py-2 !text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:!text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="last-name"
                            className="block text-sm font-semibold leading-6 "
                        >
                            {website.localize({ en: 'Last name', es: 'Apellido' })}
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="family-name"
                                className="block w-full rounded-md border-0 px-3.5 py-2 !text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:!text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm font-semibold leading-6 ">
                            {website.localize({ en: 'Email', es: 'Correo electrónico' })}
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                className="block w-full rounded-md border-0 px-3.5 py-2 !text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:!text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="phone-number"
                            className="block text-sm font-semibold leading-6 "
                        >
                            {website.localize({ en: 'Phone number', es: 'Número de teléfono' })}
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="tel"
                                name="phone-number"
                                id="phone-number"
                                autoComplete="tel"
                                className="block w-full rounded-md border-0 px-3.5 py-2 !text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:!text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 ">
                            {website.localize({ en: 'Message', es: 'Mensaje' })}
                        </label>
                        <div className="mt-2.5">
                            <textarea
                                name="message"
                                id="message"
                                rows={4}
                                className="block w-full rounded-md border-0 px-3.5 py-2 !text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:!text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={''}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    <button
                        type="submit"
                        className="rounded-md bg-primary-200 px-3.5 py-2.5 text-center text-sm font-semibold text-primary-900 shadow-sm hover:bg-primary-900 hover:text-primary-200 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {website.localize({ en: 'Send message', es: 'Enviar mensaje' })}
                    </button>
                </div>
            </div>
        </form>
    );
};
