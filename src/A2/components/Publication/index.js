import React, { useState } from 'react';
import Container from '../_utils/Container';
import { prettyPrintNames } from '../_utils/publication';
import { formatFlexibleDate } from '../_utils/date';
import { Profile, twJoin } from '@uniwebcms/module-sdk';
import { Link, SafeHtml, Image } from '@uniwebcms/core-components';
import { LuArrowLeft, LuMapPin, LuCalendar, LuDownload, LuShare2 } from 'react-icons/lu';
import { BiLinkExternal } from 'react-icons/bi';
import { SiDoi } from 'react-icons/si';
import { BeatLoader } from 'react-spinners';

const getPubTypeLabel = (type, website) => {
    if (!type) return '';

    switch (type) {
        case 'journal_articles':
            return website.localize({ en: 'Journal Article', fr: 'Article de journal' });
        case 'journal_issues':
            return website.localize({ en: 'Journal Issue', fr: 'Numéro de journal' });
        case 'books':
            return website.localize({ en: 'Book', fr: 'Livre' });
        case 'book_chapters':
            return website.localize({ en: 'Book Chapter', fr: 'Chapitre de livre' });
        case 'book_reviews':
            return website.localize({ en: 'Book Review', fr: 'Critique de livre' });
        case 'dissertations':
            return website.localize({ en: 'Dissertation', fr: 'Thèse' });
        case 'newspaper_articles':
            return website.localize({ en: 'Newspaper Article', fr: 'Article de journal' });
        case 'encyclopedia_entries':
            return website.localize({ en: 'Encyclopedia Entry', fr: "Entrée d'encyclopédie" });
        case 'magazine_entries':
            return website.localize({ en: 'Magazine Entry', fr: 'Entrée de magazine' });
        case 'dictionary_entries':
            return website.localize({ en: 'Dictionary Entry', fr: 'Entrée de dictionnaire' });
        case 'reports':
            return website.localize({ en: 'Report', fr: 'Rapport' });
        case 'working_papers':
            return website.localize({ en: 'Working Paper', fr: 'Document de travail' });
        case 'manuals':
            return website.localize({ en: 'Manual', fr: 'Manuel' });
        case 'online_resources':
            return website.localize({ en: 'Online Resource', fr: 'Ressource en ligne' });
        case 'clinical_care_guidelines':
            return website.localize({
                en: 'Clinical Care Guidelines',
                fr: 'Directives de soins cliniques',
            });
        case 'conference_publications':
            return website.localize({
                en: 'Conference Publication',
                fr: 'Publication de conférence',
            });
        case 'patents':
            return website.localize({ en: 'Patent', fr: 'Brevet' });
        case 'bibliographies':
            return website.localize({ en: 'Bibliography', fr: 'Bibliographie' });
        case 'training_materials':
            return website.localize({ en: 'Training Materials', fr: 'Matériel de formation' });
        case 'published_abstract':
            return website.localize({ en: 'Published Abstract', fr: 'Résumé publié' });
        default:
            return type;
    }
};

function getFileType(fileName, fallback) {
    if (!fileName || typeof fileName !== 'string') {
        return lang === 'fr' ? 'FICHIER' : 'FILE';
    }

    // Extract extension (handles spaces, commas, parentheses, etc.)
    const match = fileName.match(/\.([a-zA-Z0-9]+)$/);
    if (!match) {
        return lang === 'fr' ? 'FICHIER' : 'FILE';
    }

    const extension = match[1].toLowerCase();

    // Known publication-related file types
    const allowedTypes = new Set([
        'pdf',
        'doc',
        'docx',
        'ppt',
        'pptx',
        'xls',
        'xlsx',
        'txt',
        'csv',
        'zip',
        'rar',
    ]);

    if (allowedTypes.has(extension)) {
        return extension.toUpperCase();
    }

    return fallback;
}

export default function PublicationContent(props) {
    const { input, website, page } = props;
    const pub = input.profile;

    const [copied, setCopied] = useState(false);

    if (!pub) return null;

    const banner = pub.getBasicInfo()?.banner;
    const head = pub.getBasicInfo()?.head || {};

    const { title, authors, journal_title, date, publisher: venue, doi, url } = head?.data || {};

    const type = head.meta_data?._category;

    const abstract = pub.at('abstract/abstract');

    const topics =
        Profile.parseAsDisplayData(pub.rawData, website)?.topics?.value?.map(
            (i) => i.topic.value
        ) || [];

    const document = pub.at('full_document/file');
    const downloadName = document ? document.split('/').slice(1).join('/') : '';
    const downloadHref = document ? pub.getAssetInfo(document, false)?.href : null;

    const isDynamicPage = page.activeRoute.includes('[id]');

    const handleDownload = (e) => {
        e.preventDefault();

        if (downloadHref) {
            fetch(downloadHref + '&download=true')
                .then((res) => res.json())
                .then((res) => {
                    window.location.href = res;
                });
        }
    };

    const handleShare = (e) => {
        e.preventDefault();

        // copy current URL to clipboard
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <Container className="animate-in slide-in-from-right-8 duration-300">
            <div className="w-full px-4 xs:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                {isDynamicPage && (
                    <Link
                        to={input.makeHrefToIndex()}
                        className="mb-6 text-text-color/70 hover:text-text-color flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <LuArrowLeft className="w-4 h-4" />{' '}
                        {website.localize({ en: 'Back to list', fr: 'Retour à la liste' })}
                    </Link>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                {type && (
                                    <Badge variant="primary">
                                        {getPubTypeLabel(type, website)}
                                    </Badge>
                                )}
                                {journal_title && <Badge>{journal_title}</Badge>}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                {title}
                            </h1>
                            {authors && (
                                <p className="text-lg text-text-color/70 mb-2">
                                    {prettyPrintNames(authors)}
                                </p>
                            )}

                            {/* Meta Row */}
                            <div className="flex flex-wrap gap-4 text-sm 2xl:text-base text-text-color/80 mt-6 pt-6 border-t border-text-color/20">
                                {venue && (
                                    <div className="flex items-center gap-2">
                                        <LuMapPin className="w-4 h-4 2xl:w-5 2xl:h-5" /> {venue}
                                    </div>
                                )}
                                {date && (
                                    <div className="flex items-center gap-2">
                                        <LuCalendar className="w-4 h-4 2xl:w-5 2xl:h-5" />{' '}
                                        {formatFlexibleDate(date)}
                                    </div>
                                )}
                                {doi && (
                                    <div className="flex items-center gap-2">
                                        <SiDoi className="w-4 h-4 2xl:w-5 2xl:h-5" />{' '}
                                        <a
                                            href={`https://doi.org/${doi}`}
                                            className="text-text-color/80 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={website.localize({
                                                en: 'View DOI',
                                                fr: 'Voir le DOI',
                                            })}
                                        >
                                            {doi}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Body Content */}
                        <div className="prose max-w-none">
                            <h3 className="text-lg font-bold  border-b border-text-color/20 pb-2 mb-4">
                                {website.localize({ en: 'Abstract', fr: 'Résumé' })}
                            </h3>
                            <SafeHtml value={abstract} className="leading-relaxed text-lg" />
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:max-w-[320px] ml-0 lg:ml-auto space-y-6">
                        {banner && (
                            <div className="rounded-[var(--border-radius)] overflow-hidden border border-text-color/20 shadow-sm">
                                <Image
                                    profile={pub}
                                    type="banner"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Action Card */}
                        <div className="bg-text-color/5 p-6 rounded-[var(--border-radius)] border border-text-color/20">
                            <h3 className="font-bold  mb-4">
                                {website.localize({
                                    en: 'Actions & Resources',
                                    fr: 'Actions et Ressources',
                                })}
                            </h3>
                            <div className="space-y-3">
                                {document && (
                                    <button
                                        download={downloadName}
                                        onClick={handleDownload}
                                        className="bg-text-color-0 text-text-color/80 hover:text-link-color hover:bg-text-color-0 border border-text-color/20 hover:border-link-color/60 hover:shadow w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-[var(--border-radius)] transition-all"
                                    >
                                        <LuDownload className="w-4 h-4" />
                                        <span>
                                            {getFileType(
                                                downloadName,
                                                website.localize({
                                                    en: 'File',
                                                    fr: 'Fichier',
                                                })
                                            )}
                                        </span>
                                    </button>
                                )}
                                {url && (
                                    <Link
                                        to={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-text-color-0 text-text-color/80 hover:text-link-color hover:bg-text-color-0 border border-text-color/20 hover:border-link-color/60 hover:shadow w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-[var(--border-radius)] transition-all"
                                    >
                                        <BiLinkExternal className="w-4 h-4" />
                                        <span>
                                            {website.localize({
                                                en: 'URL',
                                                fr: 'Lien',
                                            })}
                                        </span>
                                    </Link>
                                )}
                                <button
                                    onClick={handleShare}
                                    className="bg-text-color-0 text-text-color/80 hover:text-link-color hover:bg-text-color-0 border border-text-color/20 hover:border-link-color/60 hover:shadow w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-[var(--border-radius)] transition-all"
                                >
                                    <LuShare2 className="w-4 h-4" />
                                    <span className={copied ? 'text-accent-500' : ''}>
                                        {copied
                                            ? website.localize({
                                                  en: 'Link copied!',
                                                  fr: 'Lien copié !',
                                              })
                                            : website.localize({
                                                  en: 'Share',
                                                  fr: 'Partager',
                                              })}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Related Tags */}
                        <div>
                            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">
                                {website.localize({ en: 'Related Topics', fr: 'Sujets Connexes' })}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {topics.map((tag) => (
                                    <Badge key={tag}>{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

const Badge = ({ children, variant = 'neutral', className }) => {
    const variants = {
        neutral: 'bg-text-color/10 text-text-color',
        primary: 'bg-primary-100 text-primary-800',
    };
    return (
        <span
            className={twJoin(
                'px-2.5 py-0.5 rounded-[var(--border-radius)] text-xs 2xl:text-sm font-medium',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

PublicationContent.Loader = ({ block }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-4">
            <BeatLoader
                color="rgba(var(--primary-700) / 1.00)"
                aria-label="Loading"
                size={12}
                margin={4}
            />
            <p className="mt-4 text-text-color text-lg lg:text-2xl">
                {block.website.localize({
                    en: 'Loading publication content...',
                    fr: 'Chargement du contenu de la publication...',
                })}
            </p>
            <p className="mt-1 text-text-color/70 text-sm lg:text-lg">
                {block.website.localize({
                    en: 'This should only take a few seconds.',
                    fr: 'Cela ne devrait prendre que quelques secondes.',
                })}
            </p>
        </div>
    );
};

PublicationContent.inputSchema = {
    type: 'reference',
};
