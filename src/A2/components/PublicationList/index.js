import React, { useState } from 'react';
import { Profile, website, twJoin } from '@uniwebcms/module-sdk';
import { Link } from '@uniwebcms/core-components';
import Container from '../_utils/Container';
import { formatFlexibleDate, sortByDateField } from '../_utils/date';
import { generateBibtex } from '../_utils/publication';
import { HiX } from 'react-icons/hi';

const parseProfiles = (profiles) => {
    return profiles.map((p) => {
        const { title, authors, journal_title, date } = p.getBasicInfo()?.head?.data || {};

        const topics =
            Profile.parseAsDisplayData(p.rawData, website)?.topics?.value?.map(
                (i) => i.topic.value
            ) || [];

        const fullDocument = p.at('full_document/file');

        return {
            title,
            authors: authors?.replace(';', ', ') || '',
            venue: journal_title,
            date,
            categories: topics,
            document: fullDocument
                ? {
                      href: p.getAssetInfo(fullDocument, false)?.href || '',
                      download: fullDocument.split('/').slice(1).join('/'),
                  }
                : null,
        };
    });
};

export default function PublicationList(props) {
    const { block, input } = props;

    const { title, subtitle, links } = block.getBlockContent();

    let publications = parseProfiles(input.profiles || []);

    console.log('publications', publications);

    const { sort = 'date_desc', title_decoration = true } = block.getBlockProperties();

    if (sort === 'title') {
        publications = publications.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'title_desc') {
        publications = publications.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sort === 'date') {
        publications = sortByDateField(publications, 'asc', 'date');
    } else if (sort === 'date_desc') {
        publications = sortByDateField(publications, 'desc', 'date');
    }

    const link = links[0];

    const allText = website.localize({
        en: 'All',
        fr: 'Tous',
    });

    const [pubFilter, setPubFilter] = useState(allText);
    const [openBibtex, setOpenBibtex] = useState(null);

    const categories = [
        ...new Set(
            publications.flatMap((p) =>
                Array.isArray(p.categories) ? p.categories : [p.categories]
            )
        ),
    ];

    categories.unshift(allText);

    const bixtex = Object.fromEntries(publications.map((pub) => [pub.title, generateBibtex(pub)]));

    return (
        <Container>
            <div className="w-full px-4 @xs:px-6 @lg:px-8 py-8 @md:py-12 @lg:py-16">
                <div className="flex flex-col @md:flex-row @md:justify-between @md:items-end gap-4 mb-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {title_decoration && (
                                <div className="w-2 h-8 bg-primary-800 rounded-[var(--border-radius)]"></div>
                            )}
                            {title}
                        </h2>
                        {subtitle && (
                            <p
                                className={twJoin(
                                    'text-text-color opacity-75 mt-2',
                                    title_decoration ? 'ml-4' : 'ml-0'
                                )}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setPubFilter(cat)}
                                className={twJoin(
                                    'px-3 py-1.5 text-sm rounded-[var(--border-radius)] border transition-all',
                                    pubFilter === cat
                                        ? 'btn-primary'
                                        : 'text-text-color bg-text-color-0 border-text-color/20 hover:bg-text-color-0 hover:border-btn-color/60'
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    {publications
                        .filter((p) => pubFilter === allText || p.categories.includes(pubFilter))
                        .map((pub, i) => (
                            <div
                                key={i}
                                className="bg-text-color-0 p-6 rounded-[var(--border-radius)] border border-text-color/20 hover:border-primary-300 transition-colors shadow-sm group"
                            >
                                <div className="flex flex-col @md:flex-row @md:justify-between @md:items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-heading-color/90 leading-tight mb-2 group-hover:text-primary-800 transition-colors">
                                            {pub.title}
                                        </h3>
                                        <p className="text-text-color/70 mb-2">{pub.authors}</p>
                                        <div className="flex flex-wrap items-center gap-3 text-sm">
                                            <span className="font-semibold text-primary-800 bg-primary-50 px-2 py-1 rounded-[var(--border-radius)] border border-primary-100">
                                                {pub.venue}
                                            </span>
                                            <span className="text-text-color/50">•</span>
                                            <span className="text-text-color/70">
                                                {formatFlexibleDate(pub.date)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {pub.document && (
                                            <button
                                                download={pub.document.download}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    fetch(pub.document.href + '&download=true')
                                                        .then((res) => res.json())
                                                        .then((res) => {
                                                            window.location.href = res;
                                                        });
                                                }}
                                                className={twJoin(
                                                    'px-2 py-1 text-sm rounded-[var(--border-radius)] border transition-all btn-secondary'
                                                )}
                                            >
                                                {website.localize({
                                                    en: 'Download',
                                                    fr: 'Télécharger',
                                                })}
                                            </button>
                                        )}
                                        <button
                                            className={twJoin(
                                                'px-2 py-1 text-sm rounded-[var(--border-radius)] border transition-all btn-secondary'
                                            )}
                                            onClick={() => setOpenBibtex(pub.title)}
                                            aria-label="Show BibTeX"
                                        >
                                            BibTeX
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                {link && (
                    <div className="mt-6 text-center">
                        <Link
                            className="block mx-auto px-4 py-2 bg-transparent hover:bg-link-hover-color/20 w-fit rounded-[var(--border-radius)]"
                            to={link.href}
                        >
                            {link.label}
                        </Link>
                    </div>
                )}
            </div>
            {openBibtex && (
                <BibTexModal
                    isOpen={bixtex[openBibtex]}
                    onClose={() => setOpenBibtex(null)}
                    content={bixtex[openBibtex]}
                    website={website}
                />
            )}
        </Container>
    );
}

const BibTexModal = ({ isOpen, onClose, content, website }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
            <div className="bg-text-color-0 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-text-color/10">
                    <h3 className="font-bold">
                        {website.localize({
                            en: 'Cite this work',
                            fr: 'Citer ce travail',
                        })}
                    </h3>
                    <button
                        onClick={onClose}
                        className="bg-transparent text-text-color/60 hover:text-text-color/80 transition-colors"
                    >
                        <HiX size={20} />
                    </button>
                </div>
                <div className="p-6 bg-neutral-50">
                    <pre className="font-mono text-xs sm:text-sm text-neutral-700 bg-text-color-0 p-4 rounded-lg border border-text-color/20 overflow-x-auto whitespace-pre-wrap">
                        {content}
                    </pre>
                </div>
                <div className="px-6 py-4 border-t border-text-color/10 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="text-sm bg-transparent text-text-color/80 hover:text-text-color transition-colors"
                    >
                        {website.localize({
                            en: 'Close',
                            fr: 'Fermer',
                        })}
                    </button>
                    <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-sm rounded-[var(--border-radius)] border transition-all"
                    >
                        {copied
                            ? website.localize({ en: 'Copied!', fr: 'Copié!' })
                            : website.localize({
                                  en: 'Copy to Clipboard',
                                  fr: 'Copier dans le presse-papiers',
                              })}
                    </button>
                </div>
            </div>
        </div>
    );
};

PublicationList.inputSchema = {
    type: 'reference',
};
