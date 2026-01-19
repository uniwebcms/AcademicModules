import React, { useState, useMemo } from 'react';
import Container from '../_utils/Container';
import { Link } from '@uniwebcms/core-components';
import { LuSearch, LuLayoutGrid, LuList, LuFilter } from 'react-icons/lu';
import { twJoin, Profile, website } from '@uniwebcms/module-sdk';
import { HiX } from 'react-icons/hi';
import { prettyPrintNames } from '../_utils/publication';
import { BeatLoader } from 'react-spinners';

const parseProfiles = (profiles, input) => {
    return profiles.map((p) => {
        const { title, authors, journal_title, date } = p.getBasicInfo()?.head?.data || {};

        const topics =
            Profile.parseAsDisplayData(p.rawData, website)?.topics?.value?.map(
                (i) => i.topic.value
            ) || [];

        return {
            title,
            authors: prettyPrintNames(authors),
            venue: journal_title,
            year: date,
            tags: topics,
            key: p.key,
            to: input.makeHref(p),
        };
    });
};

export default function Publications(props) {
    const { input, block } = props;

    const { allowLayoutSwitch = true } = block.getBlockProperties();
    const { title } = block.getBlockContent();

    const profiles = parseProfiles(input.profiles || [], input);

    const [layout, setLayout] = useState('grid');
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // Extract all unique tags from items
    const allTags = useMemo(() => {
        const tags = new Set();
        profiles.forEach((item) => item.tags?.forEach((t) => tags.add(t)));
        return Array.from(tags);
    }, [profiles]);

    // Filter logic
    const filteredItems = useMemo(() => {
        return profiles.filter((item) => {
            const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase());
            const matchesTags =
                selectedTags.length === 0 || selectedTags.every((t) => item.tags?.includes(t));
            return matchesSearch && matchesTags;
        });
    }, [profiles, search, selectedTags]);

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    return (
        <Container className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full px-4 xs:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <p className="text-text-color/80 mt-1">
                            {website.localize({
                                en: `${profiles.length} items found`,
                                fr: `${profiles.length} éléments trouvés`,
                            })}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-color/60" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-[var(--border-radius)] border border-text-color/20 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                            />
                        </div>

                        {allowLayoutSwitch && (
                            <div className="flex items-center border border-text-color/20 rounded-[var(--border-radius)] bg-text-color-0 p-1">
                                <button
                                    onClick={() => setLayout('grid')}
                                    className={twJoin(
                                        'p-1.5 rounded-[var(--border-radius)] transition-all focus:outline-none',
                                        layout === 'grid'
                                            ? 'bg-text-color/10 text-text-color'
                                            : 'bg-transparent text-text-color/70 hover:text-text-color/90'
                                    )}
                                >
                                    <LuLayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setLayout('list')}
                                    className={twJoin(
                                        'p-1.5 rounded-[var(--border-radius)] transition-all focus:outline-none',
                                        layout === 'list'
                                            ? 'bg-text-color/10 text-text-color'
                                            : 'bg-transparent text-text-color/70 hover:text-text-color/90'
                                    )}
                                >
                                    <LuList className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tag Bar */}
                {allTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-text-color/50 mr-2">
                            <LuFilter className="w-3 h-3 mr-1" />{' '}
                            {website.localize({
                                en: 'Filter:',
                                fr: 'Filtrer :',
                            })}
                        </div>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={twJoin(
                                    'text-xs px-2.5 py-1 rounded-[var(--border-radius)] border transition-all',
                                    selectedTags.includes(tag)
                                        ? 'bg-text-color/90 text-text-color-0 border-text-color/90'
                                        : 'bg-text-color-0 text-text-color/80 border-text-color/20 hover:border-text-color/30'
                                )}
                            >
                                {tag}
                            </button>
                        ))}
                        {selectedTags.length > 0 && (
                            <button
                                onClick={() => setSelectedTags([])}
                                className="bg-transparent text-text-color hover:text-text-color text-xs hover:underline focus:outline-none"
                            >
                                <HiX className="w-4 h-4 inline-block mr-1 opacity-70" />
                                {website.localize({
                                    en: 'Clear all',
                                    fr: 'Tout effacer',
                                })}
                            </button>
                        )}
                    </div>
                )}

                {/* Grid/List Render */}
                <div
                    className={twJoin(
                        'grid gap-6',
                        layout === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1'
                    )}
                >
                    {filteredItems.map((item) => (
                        <PublicationCard key={item.key} data={item} />
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 bg-text-color/5 rounded-[var(--border-radius)] border border-dashed border-text-color/20">
                        <p className="text-text-color/60">
                            {website.localize({
                                en: 'No content matches your filters.',
                                fr: 'Aucun contenu ne correspond à vos filtres.',
                            })}
                        </p>
                        <button
                            onClick={() => {
                                setSearch('');
                                setSelectedTags([]);
                            }}
                            className="bg-transparent text-primary-600 text-sm font-medium mt-2 hover:underline focus:outline-none"
                        >
                            {website.localize({
                                en: 'Reset filters',
                                fr: 'Réinitialiser les filtres',
                            })}
                        </button>
                    </div>
                )}
            </div>
        </Container>
    );
}

const PublicationCard = ({ data }) => {
    return (
        <Link
            to={data.to}
            className="group p-5 bg-text-color-0 rounded-[var(--border-radius)] border border-text-color/20 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-xs text-text-color/70 font-mono uppercase tracking-wider">
                        <span className="font-bold text-primary-700">{data.venue}</span>
                        <span>•</span>
                        <span>{data.year}</span>
                    </div>
                    <h3 className="text-lg font-serif font-semibold mb-2 group-hover:text-primary-700 leading-snug">
                        {data.title}
                    </h3>
                    <p className="text-sm text-text-color/80 mb-3">{data.authors}</p>
                    <div className="flex items-center gap-3 flex-grow mt-auto">
                        {data.tags.map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};

const Badge = ({ children }) => {
    return (
        <span
            className={twJoin(
                'px-2.5 py-0.5 rounded-[var(--border-radius)] text-xs 2xl:text-sm font-medium',
                'bg-text-color/10 text-text-color/90'
            )}
        >
            {children}
        </span>
    );
};

Publications.Loader = ({ block }) => {
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
                    en: 'Loading publications...',
                    fr: 'Chargement des publications...',
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

Publications.inputSchema = {
    type: 'reference',
};
