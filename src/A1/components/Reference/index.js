import React from 'react';
import { Image, SafeHtml, Asset, FileLogo, Link } from '@uniwebcms/core-components';
import Container from '../_utils/Container';
import { parseReference, parseProfileData } from '../_utils/reference';
import CVRefRender from '../_utils/reference/CVRefRender';
import Sidebar from './Sidebar';

export default function Reference({ website, input }) {
    const profile = input.profile;

    if (!profile) return null;

    const banner = profile.getBanner();
    const abstract = profile.at('abstract/abstract');

    const attachments = profile.at('attachments');

    let parsedData = parseReference(profile);

    let defaultCategory = website.localize({
        en: 'Others',
        fr: 'Autres',
    });

    const { data: info, error } = uniweb.useCompleteQuery('getPubTypeOptions', () => {
        const params = new URLSearchParams();
        params.append('action', 'getPubTypeOptions');
        params.append('contentType', 'reference');
        params.append('activeLang', website.getLanguage());
        return fetch(`reference.php`, {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json', // Specify content type
            // },
            body: params,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return response.json(); // Parse the JSON response
            })
            .then((res) => {
                return res;
            });
    });

    const pubTypeOptions = [];

    if (!info || error) return null;

    let typeOptions = info?.typeOptionsDisplay || [];

    typeOptions.forEach((option) => {
        pubTypeOptions.push({
            label: option[1],
            value: option[0],
        });
    });

    const metaData = profile.rawHead?.meta_data || {};
    // const originalCategory = metaData['_category'];
    // const category = originalCategory || defaultCategory;
    let category = pubTypeOptions.find((option) => option.value == metaData?.['belongs-to'] || '');

    category = category ? category.label : defaultCategory;

    const year = parsedData?.issued?.['date-parts']?.[0]?.[0] || '';

    let categoryLabel = category.replace('_', ' ');

    const { title, author, isStandard, page, pages, page_range, journal_issue, journal_volume } =
        parsedData;
    const journal = parsedData?.['container-title'] || '';

    const topics = profile.at('topics');

    const fullDocument = profile.at('full_document/file');

    const assetInfo = profile.getAssetInfo(fullDocument, false) || {};

    let pageNum = page || pages || page_range || '';

    const { href, src } = assetInfo;

    let topicsMarkup =
        topics && topics.length ? (
            <p>
                {topics.map(({ topic }, index) => {
                    const [topicId, info] = topic;
                    let parsedInfo = JSON.parse(info);

                    return (
                        <React.Fragment key={topicId}>
                            <Link
                                to={input.makeHrefToIndex(`?topic=${topicId}`)}
                                className="text-text-color-80 hover:underline cursor-pointer text-sm"
                            >
                                {parsedInfo.name}
                            </Link>
                            {index < topics.length - 1 && (
                                <span className="text-text-color-80 mr-1.5 text-sm">{','}</span>
                            )}
                        </React.Fragment>
                    );
                    // return {
                    //     value: topicId,
                    //     label: parsedInfo.name
                    // };
                })}
            </p>
        ) : null;

    let refMarkup = null;

    if (isStandard) {
        refMarkup = (
            <>
                <h2 className={'mb-2 text-text-color-80 text-lg capitalize'}>
                    {category ? (
                        <Link
                            to={input.makeHrefToIndex(`?type=${categoryLabel}`)}
                            className="text-text-color-80 hover:underline cursor-pointer"
                        >
                            <span>{categoryLabel}</span>
                        </Link>
                    ) : (
                        <span>{categoryLabel}</span>
                    )}
                    {category && year ? <span className="mx-2">|</span> : null}
                    {year ? (
                        <Link
                            to={input.makeHrefToIndex(`?year=${year}`)}
                            className="text-text-color-80 hover:underline cursor-pointer"
                        >
                            <span>{`${website.localize({
                                en: 'Published: ',
                                fr: 'Publié: ',
                            })} ${year}`}</span>
                        </Link>
                    ) : null}
                </h2>

                <div className={'flex mb-4'}>
                    {banner ? (
                        <div
                            className={
                                'w-[111px] h-[142px] flex-shrink-0 overflow-hidden !shadow-[0_1px_2px_rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.15)] bg-white mr-5'
                            }
                        >
                            <Image profile={profile} type="banner"></Image>
                        </div>
                    ) : null}
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                </div>
                <p className="text-lg text-text-color-90 mb-4">
                    {author && author.length
                        ? author
                              .map((author) => {
                                  const { given, family } = author;
                                  return `${family} ${given}${given.length === 1 ? '.' : ''}`;
                              })
                              .join(', ')
                        : null}
                </p>
                <p className="text-lg text-text-color-90 mb-4 flex items-center space-x-1.5">
                    <span className="italic">{journal}</span>
                    {year ? <span>{`(${year})`}</span> : null}
                    {pageNum ? <span>{`${pageNum}`}</span> : null}
                </p>
            </>
        );
    } else {
        const { parsedMeta, parsedData: parsedSection } = parsedData;
        let sectionPath = (parsedMeta?.['_section'] || []).join('/');
        let parsed = parseProfileData({ sections: [parsedSection] });

        refMarkup = (
            <>
                <h2 className={'mb-2 text-text-color-80 text-lg capitalize'}>
                    {category ? (
                        <Link
                            to={input.makeHrefToIndex(`?type=${categoryLabel}`)}
                            className="text-text-color-80 hover:underline cursor-pointer"
                        >
                            <span>{categoryLabel}</span>
                        </Link>
                    ) : (
                        <span>{categoryLabel}</span>
                    )}
                    {categoryLabel && year ? <span className="mx-2">|</span> : null}
                    {year ? (
                        <Link
                            to={input.makeHrefToIndex(`?year=${year}`)}
                            className="text-text-color-80 hover:underline cursor-pointer"
                        >
                            <span>{`${website.localize({
                                en: 'Date: ',
                                fr: 'Date: ',
                            })} ${year}`}</span>
                        </Link>
                    ) : null}
                </h2>

                <div className={'flex mb-4'}>
                    {banner ? (
                        <div
                            className={
                                'w-[111px] h-[142px] flex-shrink-0 overflow-hidden !shadow-[0_1px_2px_rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.15)] bg-white mr-5'
                            }
                        >
                            <Image profile={profile} type="banner"></Image>
                        </div>
                    ) : null}
                    {/* <h1 className="text-3xl font-bold tracking-tight">{title}</h1> */}
                    <CVRefRender value={parsed?.[0]?.value || []} sectionPath={sectionPath} />
                </div>
            </>
        );
    }

    return (
        <Container
            py="py-12 lg:py-16"
            className="px-6 mx-auto max-w-8xl lg:px-8 flex flex-col space-y-8 lg:flex-row lg:space-x-10 lg:space-y-0"
        >
            <div className="flex flex-col flex-1">
                {refMarkup}
                {topicsMarkup}
                {fullDocument && (
                    <div className={`flex items-center space-x-4 mt-5 mb-1 text-lg`}>
                        <a
                            target="_blank"
                            href={src}
                            className="rounded bg-primary-300 px-3.5 py-2.5 text-center text-sm font-semibold text-primary-800 shadow-sm hover:bg-primary-200 transition-all"
                        >
                            {website.localize({ en: 'See full PDF', fr: 'Voir le PDF' })}
                        </a>
                        <a
                            href={href}
                            target="_blank"
                            download={fullDocument.split('/').slice(1).join('/')}
                            onClick={(e) => {
                                e.preventDefault();
                                fetch(href + '&download=true')
                                    .then((res) => res.json())
                                    .then((res) => {
                                        window.location.href = res;
                                    });
                            }}
                            className="rounded bg-secondary-300 px-3.5 py-2.5 text-center text-sm font-semibold text-secondary-800 shadow-sm hover:bg-secondary-200 transition-all"
                        >
                            {website.localize({ en: 'Download PDF', fr: 'Télécharger le PDF' })}
                        </a>
                    </div>
                )}
                {abstract ? (
                    <div className="text-text-color flex-col mt-5 mb-4">
                        <h2 className="font-bold text-2xl mb-4 w-full border-b pb-4">
                            {website.localize({ en: 'Abstract', fr: 'Abstract' })}
                        </h2>
                        <SafeHtml className="text-lg" value={abstract} />
                    </div>
                ) : null}
                {attachments && attachments.length ? (
                    <div className="text-text-color flex-col mt-5 mb-6">
                        <h2 className="font-bold text-2xl mb-4 w-full border-b pb-4">
                            {website.localize({
                                en: 'Supplementary information',
                                fr: 'Informations supplémentaires',
                            })}
                        </h2>
                        <div className="text-text-color grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                            {attachments.map((attachment) => {
                                const { file } = attachment;
                                const filename = file.split('/').slice(1).join('/');
                                return (
                                    <div
                                        key={file}
                                        className={`w-full h-full rounded-lg border border-gray-200 flex flex-col overflow-hidden group shadow-sm`}
                                    >
                                        <div className={`h-56 lg:h-48`}>
                                            <Asset
                                                {...{
                                                    value: file,
                                                    profile,
                                                }}
                                            />
                                        </div>
                                        <div
                                            className={`flex items-center space-x-1 px-4 py-3 lg:py-2 border-t border-gray-200`}
                                        >
                                            <div className="w-8">
                                                {<FileLogo filename={filename}></FileLogo>}
                                            </div>
                                            <div
                                                className={`flex flex-col space-y-0.5 max-w-[calc(100%-40px)]`}
                                            >
                                                <p className="text-[15px]">{filename}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
            <Sidebar parsedData={parsedData} input={input} website={website} />
        </Container>
    );
}
