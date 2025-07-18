import React, { useState } from 'react';
import Cite from '../_utils/cite/Render';
import { SafeHtml, Link, Image } from '@uniwebcms/core-components';
import CitationStyle from './CitationStyles';
import { MdFileCopy } from 'react-icons/md';
import { parseReference, getDateFromIssued, parseProfileData } from '../_utils/reference';
import CVRefRender from '../_utils/reference/CVRefRender';

const options = [
    { id: 'apa', name: 'APA' },
    { id: 'vancouver', name: 'Vancouver' },
    { id: 'chicago', name: 'Chicago' },
    { id: 'mla', name: 'MLA' },
];

export default function (props) {
    const { mode = 'sticky', sticky = true, website, parsedData, input } = props;

    const sidebarStyle = props.sidebarStyle ? `${props.sidebarStyle}` : `flex flex-col`;

    const initStyle = 'md:sticky md:top-2 h-full';

    const cite = new Cite([parsedData]);

    const [selected, setSelected] = useState('apa');

    // The first argument is the Plugin name (CSL Bibliography)
    let output = cite.format('bibliography', {
        format: 'html', // output format. See comments above.
        template: selected, // 'vancouver' | 'apa' | 'harvard | 'chicago', 'mla'
        lang: website.getLanguage(), // language
    });

    let parsedReferences = input.profiles
        .map((profile) => {
            let parsedData = parseReference(profile);
            let url = input.makeHref(profile);

            return {
                ...parsedData,
                url,
                profile,
            };
        })
        .sort((a, b) => {
            return getDateFromIssued(b.issued || {}) - getDateFromIssued(a.issued || {});
        })
        .slice(0, 4);

    return (
        <div className={`hidden md:flex flex-shrink-0 w-72 md:w-[380px] justify-end`}>
            <div
                className={`pt-4 pb-6 ${mode === 'static' ? 'static' : ''}`}
                style={{
                    width: 'inherit',
                    paddingLeft: '1px',
                    paddingRight: '1px',
                }}
            >
                <div className={`${sidebarStyle} max-h-screen ${initStyle}`}>
                    <div
                        className={`w-full mb-3 z-10 shadow-xl text-text-color-90 bg-bg-color-60 rounded-2xl p-5`}
                    >
                        <div className="flex items-center mb-3">
                            <h3 className="font-bold">
                                {website.localize({ en: 'Citation', fr: 'Citation' })}
                            </h3>
                            <CitationStyle {...{ selected, setSelected, options }}></CitationStyle>
                            <MdFileCopy
                                className="cursor-pointer w-5 h-5 ml-auto text-text-color-70 hover:text-text-color-90"
                                onClick={() => {
                                    const tempInput = document.createElement('input');
                                    tempInput.value = output;
                                    document.body.appendChild(tempInput);

                                    tempInput.select();
                                    tempInput.setSelectionRange(0, 99999); // For mobile devices

                                    document.execCommand('copy');

                                    document.body.removeChild(tempInput);
                                }}
                            ></MdFileCopy>
                        </div>
                        <SafeHtml className={'text-sm'} value={output}></SafeHtml>
                    </div>
                    <div className={`w-full flex flex-col my-3 gap-5 px-1.5`}>
                        {parsedReferences.map((reference) => {
                            const { profile, url, ...rest } = reference;

                            const {
                                title,
                                issued,
                                isStandard,
                                pages,
                                page_range,
                                page,
                                issue,
                                volume,
                            } = rest;

                            let year = issued?.['date-parts']?.[0]?.[0] || '';
                            const journal = rest['container-title'] || '';

                            const banner = profile.getBanner();

                            let refMarkup = null;

                            if (isStandard) {
                                let pageNum = page || pages || page_range || '';

                                refMarkup = (
                                    <div className={`flex`} key={url}>
                                        <div
                                            className={`flex flex-col space-y-2 ${
                                                banner ? 'mr-2' : ''
                                            }`}
                                        >
                                            <Link
                                                href={url}
                                                className={`text-text-color font-medium hover:underline`}
                                            >
                                                {title}
                                            </Link>
                                            <span className={`text-text-color-80 text-xs`}>
                                                {`${journal}${
                                                    year ? `${journal ? ', ' : ''}${year}` : ''
                                                }${
                                                    volume || issue
                                                        ? `, ${volume || ''}${
                                                              issue ? `(${issue})` : ''
                                                          }`
                                                        : ''
                                                }${pageNum ? `, ${pageNum}` : ''}`}
                                            </span>
                                        </div>
                                        {banner ? (
                                            <Link
                                                href={url}
                                                className={
                                                    'cursor-pointer w-[83px] h-[106px] flex-shrink-0 overflow-hidden ml-auto !shadow-[0_1px_2px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.15)] bg-white'
                                                }
                                            >
                                                <Image profile={profile} type="banner"></Image>
                                            </Link>
                                        ) : null}
                                    </div>
                                );
                            } else {
                                const { parsedMeta, parsedData } = rest;
                                let sectionPath = (parsedMeta?.['_section'] || []).join('/');
                                let parsed = parseProfileData({ sections: [parsedData] });
                                refMarkup = (
                                    <Link href={url} key={url}>
                                        <CVRefRender
                                            value={parsed?.[0]?.value || []}
                                            sectionPath={sectionPath}
                                        />
                                    </Link>
                                );
                            }
                            return refMarkup;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
