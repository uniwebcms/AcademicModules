import React, { Fragment, useEffect, useState } from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import { Highlight, themes } from 'prism-react-renderer';
import { LuCopy, LuCheck } from 'react-icons/lu';

export default function Code(props) {
    const { language, content } = props;

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem('theme') || 'system';
        }
        return 'system';
    });

    const [systemTheme, setSystemTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const unsubscribe = uniweb.eventBus.subscribe('themeChange', (params) => {
            setTheme(params.theme || 'light');
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                setSystemTheme(newTheme);
            };
            mediaQuery.addEventListener('change', handler);
            return () => {
                mediaQuery.removeEventListener('change', handler);
            };
        }
    }, [theme]);

    const finalTheme = theme === 'system' ? systemTheme : theme;

    const darkMode = finalTheme === 'dark';

    return (
        <Highlight
            code={content.trimEnd()}
            language={language}
            theme={darkMode ? themes.oneDark : themes.oneLight}
        >
            {({ className, style, tokens, getTokenProps }) => (
                <pre
                    className={twJoin(
                        'relative !pt-12 border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/20',
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
                    <div
                        className={twJoin(
                            'not-prose absolute top-0 inset-x-0 h-10 flex items-center justify-between px-4',
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
                </pre>
            )}
        </Highlight>
    );
}
