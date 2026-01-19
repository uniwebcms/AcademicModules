import React, { useState } from 'react';
import Container from '../_utils/Container';
import { formatFlexibleDate } from '../_utils/date';
import { Profile, twJoin, stripTags } from '@uniwebcms/module-sdk';
import { Link, SafeHtml, Image } from '@uniwebcms/core-components';
import { LuArrowLeft, LuExternalLink, LuCalendar, LuShare2 } from 'react-icons/lu';
import { BeatLoader } from 'react-spinners';
import ApplyForm from './ApplyForm';

export default function OpportunityContent(props) {
    const { input, website, page, block } = props;
    const opportunity = input.profile;

    const { siteApplicationForm = false } = block.getBlockProperties();

    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!opportunity) return null;

    let tag;

    const { title, head, banner } = opportunity.getBasicInfo() || {};
    const { start_date, end_date, type } = head || {};

    if (type) {
        const [typeId, typeHead = {}] = type || [];
        const category = new Profile('category', typeId, {
            head: typeHead,
        });
        tag = category.getBasicInfo()?.title;
    }

    const startDate = formatFlexibleDate(start_date);
    const endDate = formatFlexibleDate(end_date);

    let date = startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate;

    const description = opportunity.at('opportunity_description/description');
    const eligibilityCriteria = opportunity.at('eligibility_criteria') || [];
    const deadlines = opportunity.at('deadlines') || [];
    const fundingDetails = opportunity.at('funding_details') || [];
    const applicationLink = opportunity.at('application_process/online_application_url');

    const topics =
        opportunity.at('topics')?.map(
            ({ topic: t }) =>
                new Profile('topic', t[0], {
                    head: typeof t[1] === 'string' ? JSON.parse(t[1]) : t[1],
                }).getBasicInfo()?.title
        ) || [];
    const relatedOpportunities =
        opportunity.at('related_opportunities')?.map(
            ({ related_opportunity: o }) =>
                new Profile('opportunity', o[0], {
                    head: typeof o[1] === 'string' ? JSON.parse(o[1]) : o[1],
                }).getBasicInfo()?.title
        ) || [];
    // const venue = event.at('location/venue_name');
    // const address = event.at('location/address');

    const isDynamicPage = page.activeRoute.includes('[id]');

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
                                {tag && <Badge variant="primary">{tag}</Badge>}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                {title}
                            </h1>

                            {/* Meta Row */}
                            <div className="flex flex-wrap gap-4 text-sm 2xl:text-base text-text-color/80 mt-6 pt-6 border-t border-text-color/20">
                                {date && (
                                    <div className="flex items-center gap-2">
                                        <LuCalendar className="w-4 h-4 2xl:w-5 2xl:h-5" /> {date}
                                    </div>
                                )}
                                {applicationLink && (
                                    <div className="flex items-center gap-2">
                                        <LuExternalLink className="w-4 h-4 2xl:w-5 2xl:h-5" />{' '}
                                        <a
                                            href={applicationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-link-hover-color hover:underline"
                                        >
                                            {website.localize({
                                                en: 'Apply Online',
                                                fr: 'Postuler en ligne',
                                            })}
                                        </a>
                                    </div>
                                )}
                                {/* onsite application form trigger */}
                                {siteApplicationForm && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-link-color text-link-color-0 hover:bg-link-hover-color hover:text-link-hover-color-0 px-3 py-1.5 rounded-[var(--border-radius)]"
                                    >
                                        <span className="text-current">
                                            {website.localize({
                                                en: 'Apply Now',
                                                fr: 'Postuler maintenant',
                                            })}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Body Content */}
                        <div className="space-y-8">
                            {description && (
                                <div>
                                    <h3 className="text-lg font-bold border-b border-text-color/20 pb-2 mb-4">
                                        {website.localize({ en: 'Description', fr: 'Description' })}
                                    </h3>
                                    <SafeHtml
                                        value={description}
                                        className="leading-relaxed text-lg"
                                    />
                                </div>
                            )}
                            {eligibilityCriteria.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold border-b border-text-color/20 pb-2 mb-4">
                                        {website.localize({
                                            en: 'Eligibility Criteria',
                                            fr: "Critères d'éligibilité",
                                        })}
                                    </h3>
                                    <ul className="pt-1 grid lg:grid-cols-2 grid-col-1 gap-6">
                                        {eligibilityCriteria.map((ec, i) => (
                                            <li
                                                key={i}
                                                className="flex flex-col gap-1 p-4 bg-text-color/5 rounded-[var(--border-radius)] border border-text-color/20"
                                            >
                                                <span className="text-primary-700 text-sm font-semibold">
                                                    {ec.criterion}
                                                </span>
                                                <span>{stripTags(ec.description)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {deadlines.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold border-b border-text-color/20 pb-2 mb-4">
                                        {website.localize({
                                            en: 'Deadlines',
                                            fr: 'Dates limites',
                                        })}
                                    </h3>
                                    <ul className="pt-1 grid lg:grid-cols-2 grid-col-1 gap-6">
                                        {deadlines.map((dl, i) => (
                                            <li
                                                key={i}
                                                className="flex flex-col gap-1 p-4 bg-text-color/5 rounded-[var(--border-radius)] border border-text-color/20"
                                            >
                                                <span className="text-primary-700 text-sm font-semibold">
                                                    {
                                                        {
                                                            application: website.localize({
                                                                en: 'Application',
                                                                fr: 'Candidature',
                                                            }),
                                                            document_submission: website.localize({
                                                                en: 'Document Submission',
                                                                fr: 'Soumission de documents',
                                                            }),
                                                            interview: website.localize({
                                                                en: 'Interview',
                                                                fr: 'Entretien',
                                                            }),
                                                        }[dl.deadline_type]
                                                    }
                                                </span>
                                                <p className="text-sm">
                                                    <span className="text-text-color/70 font-semibold">
                                                        {website.localize({
                                                            en: 'Date:',
                                                            fr: 'Date:',
                                                        })}
                                                    </span>{' '}
                                                    <span>{dl.deadline_date}</span>
                                                </p>
                                                <p className="text-sm">
                                                    <span className="text-text-color/70 font-semibold">
                                                        {website.localize({
                                                            en: 'Description:',
                                                            fr: 'Description:',
                                                        })}
                                                    </span>{' '}
                                                    <span>{dl.description}</span>
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {fundingDetails.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold border-b border-text-color/20 pb-2 mb-4">
                                        {website.localize({
                                            en: 'Funding Details',
                                            fr: 'Détails du financement',
                                        })}
                                    </h3>
                                    <ul className="pt-1 grid lg:grid-cols-2 grid-col-1 gap-6">
                                        {fundingDetails.map((fd, i) => (
                                            <li
                                                key={i}
                                                className="flex flex-col gap-1 p-4 bg-text-color/5 rounded-[var(--border-radius)] border border-text-color/20"
                                            >
                                                <span className="text-primary-700 text-sm font-semibold">
                                                    {
                                                        {
                                                            salary: website.localize({
                                                                en: 'Salary',
                                                                fr: 'Salaire',
                                                            }),
                                                            grant: website.localize({
                                                                en: 'Grant',
                                                                fr: 'Subvention',
                                                            }),
                                                            scholarship: website.localize({
                                                                en: 'Scholarship',
                                                                fr: 'Bourse',
                                                            }),
                                                            travel_fund: website.localize({
                                                                en: 'Travel Fund',
                                                                fr: 'Fonds de voyage',
                                                            }),
                                                        }[fd.funding_type]
                                                    }
                                                </span>
                                                <p className="text-sm">
                                                    <span className="text-text-color/70 font-semibold">
                                                        {website.localize({
                                                            en: 'Amount:',
                                                            fr: 'Montant:',
                                                        })}
                                                    </span>{' '}
                                                    <span>
                                                        {website.localize({
                                                            en: `${new Intl.NumberFormat('en-CA', {
                                                                style: 'currency',
                                                                currency: 'CAD',
                                                                currencyDisplay: 'code',
                                                            }).format(fd.amount)}${
                                                                fd.duration
                                                                    ? ` (${fd.duration})`
                                                                    : ''
                                                            }`,
                                                            fr: `${new Intl.NumberFormat('fr-CA', {
                                                                style: 'currency',
                                                                currency: 'CAD',
                                                                currencyDisplay: 'code',
                                                            }).format(fd.amount)}${
                                                                fd.duration
                                                                    ? ` (${fd.duration})`
                                                                    : ''
                                                            }`,
                                                        })}
                                                    </span>
                                                </p>
                                                <p className="text-sm">
                                                    <span>
                                                        {fd.renewable
                                                            ? website.localize({
                                                                  en: 'Renewable',
                                                                  fr: 'Renouvelable',
                                                              })
                                                            : null}
                                                    </span>
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:max-w-[320px] ml-0 lg:ml-auto space-y-6">
                        {banner && (
                            <div className="rounded-[var(--border-radius)] overflow-hidden border border-text-color/20 shadow-sm">
                                <Image
                                    profile={opportunity}
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

                        {/* Related Topics */}
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
                        {/* Related Events */}
                        <div>
                            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">
                                {website.localize({
                                    en: 'Related Opportunities',
                                    fr: 'Sujets Connexes',
                                })}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {relatedOpportunities.map((tag) => (
                                    <Badge key={tag}>{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ApplyForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                website={website}
                block={block}
                title={title}
            />
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

OpportunityContent.Loader = ({ block }) => {
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
                    en: 'Loading opportunity content...',
                    fr: 'Chargement du contenu de l’opportunité...',
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

OpportunityContent.inputSchema = {
    type: 'opportunity',
};
