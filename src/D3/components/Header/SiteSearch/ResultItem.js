import React, { Fragment } from 'react';
import Highlighter from 'react-highlight-words';
// import {useNavigate} from "react-router-dom"

function HighlightQuery({ text, query }) {
    return (
        <Highlighter
            highlightClassName="group-aria-selected:underline bg-transparent text-primary-600"
            searchWords={[query]}
            autoEscape={true}
            textToHighlight={text || ''}
        />
    );
}

function findPath(data, targetRoute, text) {
    // Helper function to recursively search for the target route.
    function search(items, path, exclusion) {
        for (const item of items) {
            // Add the current item's label to the path.
            const currentPath = [...path, item.label];

            // If the route matches, return the path.
            if (item.route === targetRoute) {
                if (item.label === exclusion) {
                    return currentPath.slice(0, -1);
                }
                return currentPath;
            }

            // If there are child items, continue searching recursively.
            if (item.child_items) {
                const result = search(item.child_items, currentPath, exclusion);
                if (result) {
                    return result;
                }
            }
        }

        // Return null if the route was not found in this branch.
        return null;
    }

    // Start the search with an empty path.
    return search(data, [], text);
}

const ResultItem = (props) => {
    const {
        website,
        title,
        description,
        href,
        route,
        banner,
        avatar,
        contentType,
        contentId,
        content,
        viewType,
        query,
        navigate,
        ...rest
    } = props;

    const activeRoute = website.activePage.activeRoute;

    const hierarchy = findPath(website.getPageHierarchy(), route, content);

    if (!hierarchy) return null;

    return (
        <li
            {...rest}
            data-route={route}
            className="group block cursor-default rounded-lg px-3 py-2 aria-selected:bg-neutral-100"
            onClick={() => navigate(route)}
        >
            <div className="text-sm text-neutral-700 group-aria-selected:text-primary-600">
                <HighlightQuery text={content} query={query} />
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-xs">
                <div className="truncate whitespace-nowrap text-neutral-500 group-aria-selected:text-neutral-600">
                    {hierarchy.map((item, index, items) => (
                        <Fragment key={index}>
                            <HighlightQuery text={item} query={query} />
                            <span
                                className={
                                    index === items.length - 1 ? 'sr-only' : 'mx-2 text-neutral-300'
                                }
                            >
                                /
                            </span>
                        </Fragment>
                    ))}
                </div>
                {activeRoute === route && (
                    <div className="ml-auto inline-block px-1.5 py-0.5 rounded bg-primary-100 text-primary-600">
                        {website.localize({
                            en: 'Current',
                            fr: 'Actuel',
                            es: 'Actual',
                            zh: '当前',
                        })}
                    </div>
                )}
            </div>
        </li>
    );
};

export default ResultItem;
