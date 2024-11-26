import React, { useEffect, useState } from 'react';

export default function Searchbar({ website }) {
    const { useNavigate, useLocation } = website.getRoutingComponents();

    const query = new URLSearchParams(useLocation().search);

    const searchParams = {};
    for (let pair of query.entries()) {
        searchParams[pair[0]] = pair[1];
    }

    const placeholder = website.localize({
        en: 'Search experts by First name, Last name or Key word(s)',
        fr: 'Rechercher des experts par prénom, nom de famille ou mot-clé(s)',
    });

    const queryText = query.get('query') || '';

    const [input, setInput] = useState(queryText);

    const navigate = useNavigate();

    useEffect(() => {
        setInput(queryText);
    }, [queryText]);

    return (
        <div className={`w-full max-w-[900px] px-2 lg:px-6`}>
            <label htmlFor="search" className={`sr-only`}>
                {placeholder}
            </label>

            <div
                className={`relative text-gray-500 focus-within:text-gray-300 flex`}
            >
                <div
                    className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}
                >
                    <svg
                        className={`h-5 w-5`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <input
                    className="bg-[rgba(0,0,0,0.1)] focus:shadow-[rgba(64,60,67,0.24)_0px_2px_8px_1px] text-gray-600 placeholder-gray-600 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:bg-white block w-full pl-10 pr-4 py-2 border border-transparent rounded-md leading-5 text-sm"
                    placeholder={placeholder}
                    type="search"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            let path = '';

                            let params = [];

                            if (input) params.push(`query=${input}`);

                            const queryStr = params.join('&');

                            if (queryStr) path += `?${queryStr}`;

                            navigate({
                                pathname: '',
                                search: path,
                            });
                        }
                    }}
                />
            </div>
        </div>
    );
}
