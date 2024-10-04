import React from 'react';
import Divider from './Divider';
import Image from './Image';
import Warning from './Warning';
import { stripTags } from '@uniwebcms/module-sdk';

const Render = function (props) {
    const { block, content, page } = props;

    const blockId = block.id;

    if (!content || !content.length) return null;

    return content.map((block, index) => {
        const { type, content } = block;

        switch (type) {
            case 'paragraph':
                return <p key={index} dangerouslySetInnerHTML={{ __html: content }}></p>;
            case 'heading':
                const { level } = block;
                const Heading = `h${level}`;

                return (
                    <Heading
                        key={index}
                        id={`Section${blockId}-${stripTags(content).replace(/\s/g, '-')}`}
                        dangerouslySetInnerHTML={{ __html: content }}
                    ></Heading>
                );
            case 'image':
                return <Image key={index} {...block} page={page} />;
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
                return (
                    <pre key={index}>
                        <code dangerouslySetInnerHTML={{ __html: content }}></code>
                    </pre>
                );
        }
    });
};

export default Render;
