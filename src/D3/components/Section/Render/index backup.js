import React from 'react';
import Divider from './Divider';
import Video from './Video';
import Image from './Image';
import Warning from './Warning';
import Card from './Card';
import Code from './Code';
import Math from './Math';
import Table from './Table';
import Details from './Details';
import { twJoin, stripTags } from '@uniwebcms/module-sdk';

function normalizeId(string) {
    return stripTags(string).replace(/\s/g, '-').toLowerCase();
}

const Render = function (props) {
    const { block: pageBlock, content, page, settings } = props;

    const {} = settings || {};

    if (!content || !content.length) return null;

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

                return (
                    <Heading
                        key={index}
                        id={`Section${blockId}-${normalizeId(content)}`}
                        style={{ textAlign: alignment }}
                        dangerouslySetInnerHTML={{ __html: content }}
                    ></Heading>
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
