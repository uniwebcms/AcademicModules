import React from 'react';
import Divider from './Divider';
import Video from './Video';
import Image from './Image';
import Warning from './Warning';
import Card from './Card';
import Code from './Code';
import Math from './Math';
import { stripTags } from '@uniwebcms/module-sdk';
import { twJoin } from '@uniwebcms/module-sdk';
import styles from './Section.module.scss';

const Render = function (props) {
    const { block: pageBlock, content, page } = props;

    if (!content || !content.length) return null;

    return content.map((block, index) => {
        const { type, content, alignment } = block;

        switch (type) {
            case 'paragraph':
                return (
                    <p
                        key={index}
                        className={styles.Block}
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{ textAlign: alignment }}></p>
                );
            case 'heading': {
                const { level } = block;
                const Heading = `h${level}`;

                const fontSize = level === 1 ? `text-4xl` : level === 2 ? `text-3xl` : 'text-2xl';

                return (
                    <Heading
                        key={index}
                        id={`Section${pageBlock.id}-${stripTags(content).replace(/\s/g, '-')}`}
                        className={`${fontSize}` + ` ${styles.Heading}`}
                        dangerouslySetInnerHTML={{ __html: content }}></Heading>
                );
            }
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
                    <ol key={index}>
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
                    <ul key={index}>
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

            case 'codeBlock':
                return <Code key={index} {...block} />;
            case 'card-group': {
                return (
                    <div key={index} className={'flex flex-wrap gap-6'}>
                        {content.map((c, i) => (
                            <Card key={`c_${i}`} {...c.attrs}></Card>
                        ))}
                    </div>
                );
            }
            case 'math_display':
                return <Math key={index} {...block} />;
            case 'button': {
                const { style } = block.attrs;

                return (
                    <div key={index} className='mt-8'>
                        <button
                            type='button'
                            className={twJoin(
                                style === 'secondary' ? 'btn-secondary' : '',
                                'px-2.5 py-1 lg:px-4 lg:py-2 border text-base lg:text-lg'
                            )}
                            dangerouslySetInnerHTML={{ __html: content }}></button>
                    </div>
                );
            }
            default:
                return null;
        }
    });
};

export default Render;
