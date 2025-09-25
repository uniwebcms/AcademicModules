import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import ResultItem from './ResultItem';
import { MdClose } from 'react-icons/md';
import { HiSearch } from 'react-icons/hi';
import FlexSearch from 'flexsearch';

const setDialogStyle = (theme, block, style) => {
    const context = theme?.split('__')?.[1];
    const colors = block.standardOptions?.colors?.elements?.[context] || {};
    const vars = block.standardOptions?.colors?.vars?.[context] || {};

    Object.keys(vars).forEach((key) => {
        style[`${key}`] = vars[key];
    });

    Object.keys(colors).forEach((key) => {
        style[`--${key}`] = colors[key];
    });
};

const SearchBox = (props) => {
    const { setResult, input, setInput, searchFn, website } = props;

    const box = useRef(null);

    useEffect(() => {
        if (box) {
            box.current.focus();
        }
    }, [box]);

    const handleSearch = (searchText) => {
        const result = searchFn(searchText);

        if (result instanceof Promise) {
            result.then((data) => {
                setResult(data);
            });
        } else {
            setResult(result);
        }
    };

    const placeholder = website.localize({
        en: 'Search...',
        fr: 'Recherche...',
    });

    return (
        <div
            className={`relative mx-auto text-neutral-600 w-full flex items-center max-w-3xl md:px-4`}
        >
            <div
                className={`bg-white rounded-lg !shadow-md overflow-hidden flex-auto flex items-center`}
            >
                <input
                    className={`w-full flex-auto appearance-none bg-transparent pl-4 pr-8 py-4 text-neutral-600 text-base sm:text-sm placeholder-neutral-500 focus:outline-none`}
                    placeholder={placeholder}
                    value={input}
                    ref={box}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(e.target.value);
                        }
                    }}
                />
                <div
                    className={`p-4 cursor-pointer group`}
                    onClick={() => {
                        handleSearch();
                    }}
                >
                    <HiSearch
                        className={`cursor-pointer w-5 h-5 text-neutral-600 group-hover:text-primary-600`}
                    />
                </div>
            </div>
        </div>
    );
};

const SearchResult = React.memo((props) => {
    const { result, website } = props;

    const fallback = (
        <div className={`flex flex-col mt-2 pt-4 md:mt-3 md:pt-3 md:px-4 max-w-3xl mx-auto`}>
            <span className={`text-white mb-4`}>
                {website.localize({
                    en: 'No search result.',
                    fr: 'Aucun résultat de recherche.',
                })}
            </span>
        </div>
    );

    let total = 0,
        hits = [];

    if (result) {
        if (!result.length) return fallback;

        hits = result?.[0]?.result;

        total = hits.length;

        if (!total) return fallback;
    } else {
        return null;
    }

    return (
        <div className={`flex flex-col mx-auto max-w-3xl w-full mt-5 md:px-4`}>
            <span className={`text-white mb-4 text-sm`}>
                {website.localize({
                    en: `${total} search results.`,
                    fr: `${total} Résultats de recherche.`,
                })}
            </span>
            <div
                className={`bg-white relative rounded-lg [overflow:overlay] max-h-[calc(100vh-240px)]`}
            >
                {hits.length
                    ? hits.map((item, i) => {
                          return <ResultItem key={i} website={website} {...item?.doc} />;
                      })
                    : null}
            </div>
        </div>
    );
});

const SearchKit = (props) => {
    const [result, setResult] = useState(null);
    const [input, setInput] = useState('');

    return (
        <div className={`flex flex-col w-full md:max-w-2xl lg:max-w-3xl mx-auto mt-12 md:mt-16`}>
            <SearchBox
                {...props}
                result={result}
                setResult={setResult}
                input={input}
                setInput={setInput}
            />
            <SearchResult {...{ result, ...props }} />
        </div>
    );
};

const Search = (props) => {
    const { block, website, iconPosition = 'center' } = props;

    const dialogStyle = {};
    const { themeName } = block;

    setDialogStyle(themeName, block, dialogStyle);

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
            closeModal();
        }
    }, [path]);

    return (
        <>
            <div
                className={`w-8 h-8 p-1 rounded-lg flex items-center justify-${iconPosition} cursor-pinter text-neutral-500 hover:bg-primary-100 hover:text-primary-500`}
                onClick={openModal}
            >
                <HiSearch className={`cursor-pointer w-6 h-6`} style={props.iconStyle} />
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className={`relative inset-0 z-50 ${themeName}`}
                    style={dialogStyle}
                    onClose={closeModal}
                >
                    <Transition.Child
                        as={Fragment}
                        enter={`ease-out duration-300`}
                        enterFrom={`opacity-0`}
                        enterTo={`opacity-100`}
                        leave={`ease-in duration-200`}
                        leaveFrom={`opacity-100`}
                        leaveTo={`opacity-0`}
                    >
                        <div
                            onClick={closeModal}
                            className={`fixed inset-0 bg-neutral-900/80 transition-opacity`}
                            aria-hidden="true"
                        ></div>
                    </Transition.Child>
                    <div className="fixed inset-0 max-w-8xl mx-auto overflow-y-auto">
                        <MdClose
                            className={`absolute top-6 right-8 md:right-12 w-8 h-8 text-neutral-300 hover:text-neutral-100 cursor-pointer z-[51]`}
                            onClick={closeModal}
                        ></MdClose>
                        <Transition.Child
                            as="div"
                            enter={`ease-out duration-300`}
                            enterFrom={`opacity-0 scale-95`}
                            enterTo={`opacity-100 scale-100`}
                            leave={`ease-in duration-200`}
                            leaveFrom={`opacity-100 scale-100`}
                            leaveTo={`opacity-0 scale-95`}
                        >
                            <Dialog.Panel>
                                <SearchKit website={website} searchFn={query}></SearchKit>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default Search;
