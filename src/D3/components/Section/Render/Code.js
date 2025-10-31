import React, { Fragment, useState } from 'react';
import { twJoin, useSiteTheme } from '@uniwebcms/module-sdk';
import { Highlight, themes } from 'prism-react-renderer';
import { LuCopy, LuCheck } from 'react-icons/lu';

export default function Code(props) {
    const { language, content } = props;

    const { theme: finalTheme } = useSiteTheme();

    const [copied, setCopied] = useState();

    const darkMode = finalTheme === 'dark';

    return (
        <Highlight
            code={content.trimEnd()}
            language={language}
            theme={darkMode ? themes.oneDark : themes.oneLight}
        >
            {({ className, style, tokens, getTokenProps }) => (
                <div className="relative">
                    <pre
                        className={twJoin(
                            '!pt-12 overflow-x-auto border-[length:var(--depth-style-outline)] !rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/20',
                            className
                        )}
                        style={style}
                    >
                        <code>
                            {tokens.map((line, lineIndex) => (
                                <Fragment key={lineIndex}>
                                    {line
                                        .filter((token) => !token.empty)
                                        .map((token, tokenIndex) => (
                                            <span key={tokenIndex} {...getTokenProps({ token })} />
                                        ))}
                                    {'\n'}
                                </Fragment>
                            ))}
                        </code>
                    </pre>
                    <div
                        className={twJoin(
                            'not-prose absolute top-[length:var(--depth-style-outline)] inset-x-[length:var(--depth-style-outline)] h-10 flex items-center justify-between px-4 rounded-t-[var(--border-radius)]',
                            darkMode ? 'bg-[#424957]' : 'bg-[#f0f0f0]'
                        )}
                    >
                        <p className="text-sm">{language}</p>
                        <button
                            type="button"
                            className="text-sm focus:outline-none bg-transparent"
                            onClick={() => {
                                navigator.clipboard.writeText(content.trimEnd());
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                        >
                            {copied ? (
                                <LuCheck className="w-5 h-5 text-accent-500" />
                            ) : (
                                <LuCopy className="w-5 h-5 text-text-color/80 hover:text-text-color" />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </Highlight>
    );
}
