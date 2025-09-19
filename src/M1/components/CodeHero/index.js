import React from 'react';
import Container from '../_utils/Container';
import { twJoin } from '@uniwebcms/module-sdk';
import { Link } from '@uniwebcms/core-components';
import { motion } from 'framer-motion';
import { RiArrowRightLine, RiCodeSSlashFill } from 'react-icons/ri';

const CodeExample = ({ code, title, description }) => (
    <div
        className={twJoin('border rounded-lg overflow-hidden', 'bg-primary-900 border-neutral-800')}
    >
        <div
            className={twJoin(
                'border-b  p-3 flex items-center justify-between',
                'border-neutral-800'
            )}
        >
            <div className="flex items-center gap-2">
                <RiCodeSSlashFill className={twJoin('w-4 h-4', 'text-secondary-400')} />
                <span className={twJoin('text-sm font-medium', 'text-neutral-300')}>{title}</span>
            </div>
        </div>
        <div className="p-4">
            <pre className="text-sm font-mono text-neutral-100 overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
        {description && (
            <div className="border-t border-neutral-800 p-3">
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
        )}
    </div>
);

export default function CodeHero(props) {
    const { block } = props;

    const { title, subtitle, links, properties } = block.getBlockContent();

    const [firstLink, secondLink] = links;

    const { childBlocks } = block;

    const code = childBlocks[0] ? childBlocks[0].getBlockContent().properties : '';

    return (
        <Container className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-secondary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent-500/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 text-center lg:text-left"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                {title}
                            </h1>
                            <p className="text-xl">{subtitle}</p>
                            <div className="max-w-full flex flex-wrap gap-4 pt-4">
                                {firstLink && (
                                    <Link
                                        to={firstLink.href}
                                        className="flex-grow lg:flex-none max-w-full"
                                    >
                                        <button
                                            type="button"
                                            className="w-full lg:w-auto inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 rounded-md px-8 gap-2 border-none"
                                        >
                                            {firstLink.label}
                                            <RiArrowRightLine className="w-4 h-4 text-inherit" />
                                        </button>
                                    </Link>
                                )}
                                {secondLink && (
                                    <Link
                                        to={secondLink.href}
                                        className="flex-grow lg:flex-none max-w-full"
                                    >
                                        <button className="w-full lg:w-auto inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 rounded-md px-8 gap-2 border-none btn-secondary">
                                            <RiCodeSSlashFill className="w-4 h-4" />
                                            {secondLink.label}
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 max-w-full"
                    >
                        <CodeExample code={code} {...properties} />
                    </motion.div>
                </div>
            </div>
        </Container>
    );
}
