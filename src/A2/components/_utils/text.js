import React, { useState } from 'react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { SafeHtml } from '@uniwebcms/core-components';
import { stripTags } from '@uniwebcms/module-sdk';

export const ExpandableText = ({ text, className = '', website }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Simple heuristic: if text is short enough, don't truncate
    // Ideally we'd measure height, but line clamping is CSS-based
    // We'll assume if it's under 300 chars it probably fits in 3 lines (rough estimate)
    const shouldTruncate = stripTags(text).length > 300;

    if (!shouldTruncate) {
        return (
            <SafeHtml
                className={`leading-relaxed text-base lg:text-lg [&>p+p]:mt-2 lg:[&>p+p]:mt-3 ${className}`}
                value={text}
            />
        );
    }

    return (
        <div className={className}>
            <SafeHtml
                className={`leading-relaxed text-base lg:text-lg [&>p+p]:mt-2 lg:[&>p+p]:mt-3 transition-all duration-300 ${
                    !isExpanded ? 'line-clamp-3' : ''
                }`}
                value={text}
            />
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 bg-text-color-0 text-primary-700 font-medium text-sm flex items-center hover:underline focus:outline-none"
            >
                {isExpanded ? (
                    <>
                        {website.localize({
                            en: 'Show Less',
                            fr: 'Voir Moins',
                        })}{' '}
                        <LuChevronUp className="ml-1 h-4 w-4" />
                    </>
                ) : (
                    <>
                        {website.localize({
                            en: 'Show More',
                            fr: 'Voir Plus',
                        })}{' '}
                        <LuChevronDown className="ml-1 h-4 w-4" />
                    </>
                )}
            </button>
        </div>
    );
};
