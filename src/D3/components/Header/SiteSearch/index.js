import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { LuSearch } from 'react-icons/lu';
import ResultItem from './ResultItem';
import FlexSearch from 'flexsearch';

function SearchIcon(props) {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
            <path d="M16.293 17.707a1 1 0 0 0 1.414-1.414l-1.414 1.414ZM9 14a5 5 0 0 1-5-5H2a7 7 0 0 0 7 7v-2ZM4 9a5 5 0 0 1 5-5V2a7 7 0 0 0-7 7h2Zm5-5a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7v2Zm8.707 12.293-3.757-3.757-1.414 1.414 3.757 3.757 1.414-1.414ZM14 9a4.98 4.98 0 0 1-1.464 3.536l1.414 1.414A6.98 6.98 0 0 0 16 9h-2Zm-1.464 3.536A4.98 4.98 0 0 1 9 14v2a6.98 6.98 0 0 0 4.95-2.05l-1.414-1.414Z" />
        </svg>
    );
}

const SearchBox = (props) => {
    const { input, setInput, website, handleKeyDown, box } = props;

    useEffect(() => {
        if (box.current) {
            box.current.focus();
        }
    }, []);

    const placeholder = website.localize({
        en: 'Find something...',
        fr: 'Trouvez quelque chose...',
    });

    return (
        <div className="group relative flex h-12">
            <SearchIcon
                onClick={() => {
                    handleSearch(input);
                }}
                className="cursor-pointer absolute left-4 top-0 h-full w-5 fill-text-color/60"
            />
            <input
                className={
                    'flex-auto appearance-none bg-transparent pl-12 outline-none placeholder:text-text-color/60 focus:w-full focus:flex-none focus:outline-none text-sm md:text-base [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden pr-4'
                }
                placeholder={placeholder}
                value={input}
                ref={box}
                onChange={(e) => {
                    setInput(e.target.value);
                }}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

const SearchResult = React.memo((props) => {
    const { input, result, website, setResult, searchFn, box } = props;
    const [fallback, setFallback] = useState(null);
    const [ariaSelected, setAriaSelected] = useState(0);
    const { useNavigate } = website.getRoutingComponents();
    const navigate = useNavigate();

    const listRef = useRef(null);

    const switchAriaSelected = (index) => () => {
        setAriaSelected(index);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setAriaSelected(null);

            const result = searchFn(input);
            if (result instanceof Promise) {
                result.then((data) => {
                    setResult(data);
                });
            } else {
                setResult(result);
            }

            if (input === '') {
                setFallback(null);
            } else {
                setFallback(
                    <p className="px-4 py-8 text-center text-sm md:text-base text-text-color/60">
                        No results for &ldquo;
                        <span className="break-words text-text-color/90">{input}</span>
                        &rdquo;
                    </p>
                );
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [input]);

    const hits = result?.[0]?.result;

    if (result) {
        if (!result.length) return fallback;

        if (!hits.length) return fallback;
    } else {
        return null;
    }

    const handleKeyDown = (e) => {
        if (ariaSelected === null && hits.length > 0) {
            setAriaSelected(0);
        } else if (e.key === 'ArrowDown') {
            setAriaSelected((prevIndex) => (prevIndex === hits.length - 1 ? 0 : prevIndex + 1));
            listRef.current.focus();
        } else if (e.key === 'ArrowUp') {
            setAriaSelected((prevIndex) => (prevIndex === 0 ? hits.length - 1 : prevIndex - 1));
        } else if (e.key === 'Enter') {
            const selectedItem = listRef.current.querySelector(`[aria-selected="true"]`);
            const route = selectedItem?.getAttribute('data-route');

            if (route) {
                navigate(route);
            }
        } else {
            box.current.focus();
        }
    };

    return (
        <ul
            ref={listRef}
            onKeyDown={handleKeyDown}
            role="listbox"
            tabIndex={0}
            className="max-h-80 overflow-y-auto focus:outline-none"
        >
            {hits.map((item, i) => {
                return (
                    <ResultItem
                        key={i}
                        website={website}
                        aria-selected={ariaSelected === i ? 'true' : 'false'}
                        onMouseEnter={switchAriaSelected(i)}
                        navigate={navigate}
                        {...item?.doc}
                    />
                );
            })}
        </ul>
    );
});

const SearchKit = (props) => {
    const [result, setResult] = useState(null);
    const [input, setInput] = useState('');
    const box = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown' && result && result.length) {
            e.preventDefault(); // Prevent default scrolling behavior
            document.querySelector("[role='listbox']").focus();
        }
    };

    return (
        <>
            <SearchBox
                {...props}
                result={result}
                setResult={setResult}
                input={input}
                setInput={setInput}
                handleKeyDown={handleKeyDown}
                box={box}
            />
            <div className="border-t border-text-color/20 bg-text-color/10 px-2 py-3 empty:hidden">
                <SearchResult {...{ input, result, setResult, box, ...props }} />
            </div>
        </>
    );
};

const Search = (props) => {
    const { website, searchPosition } = props;

    let [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const { useLocation } = website.getRoutingComponents();
    const location = useLocation();

    const path = location.pathname;

    const [searcher, setSearcher] = useState(null);

    const query = useCallback(
        (text) => {
            if (!searcher) {
                return website.getSearchData().then((data) => {
                    const index = new FlexSearch.Document({
                        document: {
                            id: 'href',
                            index: ['content'],
                            store: [
                                'href',
                                'title',
                                'description',
                                'route',
                                'contentType',
                                'viewType',
                                'contentId',
                                'banner',
                                'avatar',
                            ],
                        },
                        cache: true,
                        tokenize: 'forward',
                    });

                    const add = (sequential_data) => {
                        for (let x = 0, data; x < sequential_data.length; x++) {
                            data = sequential_data[x];

                            index.add({
                                ...data,
                                content: `${data.title} ${data.description} ${data.content}`,
                            });
                        }
                    };

                    add(data);

                    setSearcher(index);

                    if (website) {
                        website.submitEvent('search', {
                            search_term: text,
                        });
                    }

                    return index.search(text, {
                        enrich: true,
                    });
                });
            } else {
                if (website) {
                    website.submitEvent('search', {
                        search_term: text,
                    });
                }

                return searcher.search(text, {
                    enrich: true,
                });
            }
        },
        [searcher]
    );

    useEffect(() => {
        if (isOpen) {
            return;
        }

        function onKeyDown(event) {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                openModal();
            }
        }

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, setIsOpen]);

    useEffect(() => {
        if (isOpen) {
            closeModal();
        }
    }, [path]);

    return (
        <>
            {searchPosition === 'center' ? (
                <button
                    type="button"
                    className="hidden md:flex p-1.5 items-center w-8 h-8 rounded-lg bg-transparent hover:bg-text-color-0 hover:w-44 xl:hover:w-64 transition-all duration-300 group overflow-hidden gap-2 shadow-none hover:shadow-sm border border-transparent hover:border-text-color/40 focus:ring-0 focus:outline-none"
                    onClick={openModal}
                >
                    <LuSearch className="h-5 w-5 text-text-color/70 group-hover:text-text-color/90 flex-shrink-0" />
                    <p className="text-sm w-0 group-hover:w-fit hidden md:group-hover:block transition-all duration-1000 text-nowrap text-text-color-80">
                        {website.localize({
                            en: 'Quick Search...',
                            fr: 'Recherche Rapide...',
                        })}
                    </p>
                </button>
            ) : (
                <button
                    type="button"
                    className="flex items-center bg-transparent focus:ring-0 focus:outline-none"
                    onClick={openModal}
                >
                    <LuSearch className="h-5 w-5 text-icon-color hover:text-icon-color/80 transition-colors duration-200" />
                </button>
            )}
            <Dialog
                open={isOpen}
                as="div"
                className={`context__light relative inset-0 z-50`}
                onClose={closeModal}
            >
                <div className="fixed inset-0 bg-text-color/80 backdrop-blur" />
                <div className="fixed inset-0 overflow-y-auto px-4 py-4 md:px-6 md:py-20 lg:px-8">
                    <Dialog.Panel className="mx-auto transform-gpu overflow-hidden rounded-xl bg-text-color-0 shadow-xl sm:max-w-xl">
                        <div aria-expanded={false} aria-haspopup="listbox" role="combobox">
                            <SearchKit website={website} searchFn={query} />
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
};

export default Search;

/*
<button
                    type="button"
                    className="flex md:p-1 md:hover:px-1.5 items-center w-5 md:w-8 h-8 rounded-lg md:hover:bg-text-color-0 md:hover:w-44 xl:hover:w-64 transition-all duration-300 focus:outline-none group overflow-hidden gap-2 ring-0 md:hover:ring-1 shadow-none md:hover:shadow-sm md:hover:ring-text-color/40 bg-transparent"
                    onClick={openModal}
                >
                    <LuSearch className="h-5 w-5 text-text-color/60 flex-shrink-0" />
                    <p className="text-sm w-0 group-hover:w-fit hidden md:group-hover:block transition-all duration-1000 text-nowrap text-text-color/50">
                        {website.localize({
                            en: 'Quick Search...',
                            fr: 'Recherche Rapide...',
                        })}
                    </p>
                </button>
                */
