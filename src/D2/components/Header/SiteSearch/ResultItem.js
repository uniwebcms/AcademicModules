import React, { Fragment } from 'react';
import Highlighter from 'react-highlight-words';
// import {useNavigate} from "react-router-dom"

function HighlightQuery({ text, query }) {
    return (
        <Highlighter
            highlightClassName="group-aria-selected:underline bg-transparent text-sky-600 dark:text-sky-400"
            searchWords={[query]}
            autoEscape={true}
            textToHighlight={text}
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
        query,
        ...rest
    } = props;

    const hierarchy = findPath(website.getPageHierarchy(), route, content);

    return (
        <li
            {...rest}
            data-route={route}
            className="group block cursor-default rounded-lg px-3 py-2 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700/30"
            // onClick={() => navigate(route)}
        >
            <div className="text-sm text-slate-700 group-aria-selected:text-sky-600 dark:text-slate-300 dark:group-aria-selected:text-sky-400">
                <HighlightQuery text={content} query={query} />
            </div>
            <div className="mt-0.5 truncate whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                {hierarchy.map((item, index, items) => (
                    <Fragment key={index}>
                        <HighlightQuery text={item} query={query} />
                        <span
                            className={
                                index === items.length - 1
                                    ? 'sr-only'
                                    : 'mx-2 text-slate-300 dark:text-slate-700'
                            }
                        >
                            /
                        </span>
                    </Fragment>
                ))}
            </div>
        </li>
    );
};

export default ResultItem;
