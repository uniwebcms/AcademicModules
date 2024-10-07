/**
 * Enable website search across all pages.
 * @module SiteSearch
 */

import React, { Suspense } from 'react';
import { website, getComponent } from '@uniwebcms/module-sdk';

const Search = getComponent('widgets', 'SiteSearch');

/**
 * Create a SiteSearch widget.
 *
 * @example
 * function MyComponent() {
 *    return (
 *       <SiteSearch />
 *    );
 * }
 *
 * @component SiteSearch
 * @returns {function} A Search component.
 */
export default function (props) {
    return (
        <Suspense fallback={''}>
            <Search
                website={website}
                iconClassName={
                    'text-text-color-90 hover:text-text-color w-5 h-5 hover:scale-125 transition-all duration-300'
                }
                iconPosition='end'
            />
        </Suspense>
    );
}
