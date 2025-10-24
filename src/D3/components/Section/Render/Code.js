import React, { Fragment } from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import { Highlight } from 'prism-react-renderer';

export default function Code(props) {
    const { language, content } = props;

    return (
        <Highlight code={content.trimEnd()} language={language} theme={{ plain: {}, styles: [] }}>
            {({ className, style, tokens, getTokenProps }) => (
                <pre
                    className={twJoin(
                        // 'rounded-xl bg-slate-200 shadow-lg dark:bg-slate-800/60 dark:shadow-none dark:ring-1 dark:ring-slate-300/10 text-base py-[12px] px-[16px]',
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
            )}
        </Highlight>
    );
}
