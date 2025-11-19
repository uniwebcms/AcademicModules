import React, { useState } from 'react';
import { LuSearch, LuX } from 'react-icons/lu';

export default function HomeHero(props) {
    const { website, block } = props;

    const { useNavigate, useLocation } = website.getRoutingComponents();
    const { form } = block.getBlockContent();

    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const submitRef = React.useRef(null);

    console.log('ref', submitRef.current?.getBoundingClientRect()?.width);

    const handleNavigateWithParam = (key, value) => {
        const params = new URLSearchParams(location.search);

        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        const searchQuery = params.toString();
        navigate(`search${searchQuery ? `?${searchQuery}` : ''}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle search logic here, e.g., redirect to search results page
        console.log('Search query:', query);

        if (!query.trim()) {
            return;
        }

        handleNavigateWithParam('search', query.trim());
    };

    return (
        <section className="">
            {/* heading text */}
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">
                    {website.localize({
                        en: 'Find an Expert',
                        fr: 'Trouvez un Expert',
                    })}
                </h1>
                <p className="text-lg">
                    {website.localize({
                        en: 'Connect with researchers, faculty, and experts for media interviews and analysis.',
                        fr: 'Connectez-vous avec des chercheurs, des enseignants et des experts pour des interviews et des analyses médiatiques.',
                    })}
                </p>
            </div>
            {/* search bar */}
            <form onSubmit={handleSubmit} className="mt-10 max-w-2xl mx-auto">
                <label htmlFor="search-expert" className="sr-only">
                    Search for an expert
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LuSearch className="h-5 w-5" />
                    </div>
                    <input
                        type="search"
                        id="search-expert"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={website.localize({
                            en: 'Search by name, topic, or keyword',
                            fr: 'Rechercher par nom, sujet ou mot-clé',
                        })}
                        className="w-full pl-12 pr-32 py-4 text-lg border border-text-color/20 shadow focus:outline-none focus:ring-2 focus:ring-btn-hover-color focus:border-transparent focus:shadow-md rounded-[var(--border-radius)] placeholder:text-text-color/50"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            aria-label="Clear search"
                            style={{ right: submitRef.current?.getBoundingClientRect()?.width + 6 }}
                            className="absolute inset-y-0 pr-2 flex items-center z-10 cursor-pointer bg-transparent focus:outline-none"
                        >
                            <LuX className="h-5 w-5" />
                        </button>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                            ref={submitRef}
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btn-hover-color h-full rounded-r-[var(--border-radius)]"
                        >
                            {website.localize({
                                en: 'Search',
                                fr: 'Rechercher',
                            })}
                        </button>
                    </div>
                </div>
            </form>
            {/* category items */}
            {form.map((category) => (
                <div key={category.key} className="mt-12 max-w-4xl mx-auto">
                    <h3 className="text-sm font-semibold text-text-color/70 uppercase tracking-wider text-center tag-label">
                        {category.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {category.items.map((topic) => (
                            <button
                                key={topic.name}
                                onClick={() => handleNavigateWithParam(category.key, topic.name)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 bg-btn-alt-color text-btn-alt-text-color hover:bg-btn-alt-hover-color hover:text-btn-alt-hover-text-color focus:ring-btn-alt-text-color rounded-[var(--border-radius)]"
                            >
                                {topic.name}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}
