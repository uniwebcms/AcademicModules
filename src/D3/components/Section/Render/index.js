import { twJoin, stripTags } from '@uniwebcms/module-sdk';
import React, { useState, useCallback } from 'react';
import { FiHash, FiCheck } from 'react-icons/fi';
import Divider from './Divider';
import Video from './Video';
import Image from './Image';
import Warning from './Warning';
import Card from './Card';
import Code from './Code';
import Math from './Math';
import Table from './Table';
import Details from './Details';

function normalizeId(string) {
    return stripTags(string).replace(/\s/g, '-').toLowerCase();
}

const Render = function (props) {
    const { block: pageBlock, content, page, settings } = props;

    if (!content || !content.length) return null;

    const [copiedId, setCopiedId] = useState('');

    const handleCopyLink = useCallback((id) => {
        // Creates the full URL with the hash
        const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${id}`;

        navigator.clipboard
            .writeText(url)
            .then(() => {
                setCopiedId(id);
                setTimeout(() => {
                    setCopiedId('');
                }, 2000);
            })
            .catch((err) => {
                console.error('Failed to copy link: ', err);
            });
    }, []);

    return content.map((block, index) => {
        const { type, content, alignment } = block;

        switch (type) {
            case 'paragraph':
                return (
                    <p
                        key={index}
                        // className={settings?.paragraph_standout ? 'lead' : ''}
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{ textAlign: alignment }}
                    ></p>
                );
            case 'heading':
                const { level } = block;
                const blockId = pageBlock?.id || '';
                const Heading = `h${level}`;

                const id = `Section${blockId}-${normalizeId(content)}`;

                // Wrap the heading in a 'group' div to control
                // the icon's visibility on hover.
                return (
                    <div key={index} className="group relative">
                        <Heading
                            id={id}
                            style={{ textAlign: alignment }}
                            dangerouslySetInnerHTML={{ __html: content }}
                        ></Heading>

                        {/* This is the new icon button */}
                        <button
                            onClick={() => handleCopyLink(id)}
                            className={twJoin(
                                'absolute top-1/2 -translate-y-1/2 -left-7', // Your positioning
                                'focus:outline-none', // Your styling

                                // --- ADD THESE CLASSES ---
                                'opacity-0',
                                'transition-opacity duration-200', // Standard 200ms fade
                                'delay-200', // DEFAULT: Wait 200ms before hiding
                                'group-hover:opacity-100', // On parent hover, become visible
                                'group-hover:delay-0', // ON ENTRY: Appear instantly (override delay)
                                'hover:opacity-100', // ON SELF-HOVER: Stay visible
                                // -------------------------
                                'bg-transparent'
                            )}
                            aria-label="Copy link to this section"
                        >
                            {copiedId === id ? (
                                // Show green checkmark when copied
                                <FiCheck className="h-5 w-5 text-heading-color" />
                            ) : (
                                // Show hash icon by default
                                <FiHash className="h-5 w-5 text-heading-color/80 hover:text-heading-color" />
                            )}
                        </button>
                    </div>
                );
            case 'image':
                return <Image key={index} {...block} page={page} />;
            case 'video':
                const { video_control: videoControl = false } = pageBlock.getBlockProperties();
                return <Video key={index} {...block} page={page} videoControl={videoControl} />;
            case 'warning':
                return <Warning key={index} {...block} />;
            case 'divider':
                return <Divider key={index} {...block} />;
            case 'orderedList':
                return (
                    <ol key={index} className="list-decimal pl-5">
                        {content.map((item, i) => {
                            return (
                                <li key={i}>
                                    <Render content={item} />
                                </li>
                            );
                        })}
                    </ol>
                );
            case 'bulletList':
                return (
                    <ul key={index} className="list-disc pl-5">
                        {content.map((item, i) => {
                            return (
                                <li key={i}>
                                    <Render content={item} />
                                </li>
                            );
                        })}
                    </ul>
                );
            case 'blockquote':
                return (
                    <blockquote key={index}>
                        <Render content={content} />
                    </blockquote>
                );

            case 'codeBlock': {
                return <Code key={index} {...block} />;
            }
            case 'card-group': {
                // use figure tag to wrap cards is for typographic purposes
                return (
                    <figure key={index} className={'flex flex-wrap gap-6'}>
                        {content.map((c, i) => (
                            <Card key={`c_${i}`} {...c.attrs}></Card>
                        ))}
                    </figure>
                );
            }
            case 'math_display':
                return <Math key={index} {...block} />;
            case 'button':
                const { style } = block.attrs;

                return (
                    <div key={index} className="mb-3 lg:mb-4">
                        <button
                            type="button"
                            className={twJoin(
                                style === 'secondary' ? 'btn-secondary' : '',
                                'px-2.5 py-1 lg:px-4 lg:py-2 border text-base lg:text-lg'
                            )}
                            dangerouslySetInnerHTML={{ __html: content }}
                        ></button>
                    </div>
                );
            case 'table':
                return <Table key={index} {...block} />;
            case 'details': {
                return <Details key={index} {...block} />;
            }
            default:
                return null;
        }
    });
};

export default Render;
