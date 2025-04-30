import React from 'react';
import getFieldValue from '../utils/fieldValueParser';
import ReactDOMServer from 'react-dom/server';

export default function TelephoneResolver(props) {
    const { '@': content } = props;

    const [phone_type, country_code, area_code, telephone_number, extension, dates] = content;

    const phoneType = getFieldValue(phone_type);
    const countryCode = getFieldValue(country_code);
    const areaCode = getFieldValue(area_code);
    const telephoneNumber = getFieldValue(telephone_number);
    const ext = getFieldValue(extension);
    const dateRange = ReactDOMServer.renderToStaticMarkup(dates);

    if (phoneType || countryCode || areaCode || telephoneNumber || ext) {
        return (
            <p>
                {phoneType ? <>{phoneType}: </> : ''}
                {countryCode ? <>+{countryCode} </> : ''}
                {areaCode ? <>({areaCode}) </> : ''}
                {telephoneNumber ? <>{telephoneNumber} </> : ''}
                {ext ? <>x {ext} </> : ''}
                {dateRange ? (
                    <>
                        | <span dangerouslySetInnerHTML={{ __html: dateRange }} />
                    </>
                ) : (
                    ''
                )}
            </p>
        );
    }

    return null;
}
