import React from 'react';
import Container from '../_utils/Container';
import { Link, twJoin } from '@uniwebcms/module-sdk';
import { motion } from 'framer-motion';
import { RiArrowRightLine, RiCodeSSlashFill } from 'react-icons/ri';

const codeContainerStyleDefault = 'bg-text-color/10 border-text-color/20';
const codeContainerStylePolarNight = 'bg-slate-900 border-zinc-800';

const codeTitleBorderColorDefault = 'border-text-color/20';
const codeTitleBorderColorPolarNight = 'border-zinc-800';

const codeTitleIconColorDefault = 'text-primary-500';
const codeTitleIconColorPolarNight = 'text-blue-400';

const codeTitleColorDefault = 'text-text-color';
const codeTitleColorPolarNight = 'text-zinc-300';

const CodeExample = ({ code, title, description, uiPreset }) => (
    <div
        className={twJoin(
            'border rounded-lg overflow-hidden',
            uiPreset === 'polar_night' ? codeContainerStylePolarNight : codeContainerStyleDefault
        )}
    >
        <div
            className={twJoin(
                'border-b border-zinc-800 p-3 flex items-center justify-between',
                uiPreset === 'polar_night'
                    ? codeTitleBorderColorPolarNight
                    : codeTitleBorderColorDefault
            )}
        >
            <div className="flex items-center gap-2">
                <RiCodeSSlashFill
                    className={twJoin(
                        'w-4 h-4',
                        uiPreset === 'polar_night'
                            ? codeTitleIconColorPolarNight
                            : codeTitleIconColorDefault
                    )}
                />
                <span
                    className={twJoin(
                        'text-sm font-medium',
                        uiPreset === 'polar_night'
                            ? codeTitleColorPolarNight
                            : codeTitleColorDefault
                    )}
                >
                    {title}
                </span>
            </div>
        </div>
        <div className="p-4">
            <pre className="text-sm font-mono text-zinc-100 overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
        {description && (
            <div className="border-t border-zinc-800 p-3">
                <p className="text-sm text-zinc-400">{description}</p>
            </div>
        )}
    </div>
);

export default function CodeHero(props) {
    const { block } = props;

    const { title, subtitle, links, properties } = block.getBlockContent();

    const [firstLink, secondLink] = links;

    const { appearance_preset = 'none' } = block.getBlockProperties();

    const code = properties.find((property) => typeof property === 'string');
    const codeInfo = properties.find(
        (property) => typeof property === 'object' && property.title && property.description
    );

    let backgroundOverlay;

    if (appearance_preset === 'polar_night') {
        backgroundOverlay = (
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>
        );
    }

    return (
        <Container px="sm" className="relative max-w-6xl mx-auto">
            {backgroundOverlay}
            <div className="relative">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                {title}
                            </h1>
                            <p className="text-xl">{subtitle}</p>
                            <div className="flex gap-4 pt-4">
                                {firstLink && (
                                    <Link to={firstLink.href}>
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 rounded-md px-8 gap-2 border-none btn-primary"
                                        >
                                            {firstLink.label}
                                            <RiArrowRightLine className="w-4 h-4 text-inherit" />
                                        </button>
                                    </Link>
                                )}
                                {secondLink && (
                                    <Link to={secondLink.href}>
                                        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 rounded-md px-8 gap-2 border-none btn-secondary">
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
                        className="flex-1"
                    >
                        <CodeExample
                            code={code}
                            title={codeInfo?.title}
                            description={codeInfo?.description}
                            uiPreset={appearance_preset}
                        />
                    </motion.div>
                </div>
            </div>
        </Container>
    );
}
