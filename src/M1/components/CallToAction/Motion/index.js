import React from 'react';
import Container from '../../_utils/Container';
import { Link, stripTags } from '@uniwebcms/module-sdk';
import { motion, useInView } from 'framer-motion';

export default function Motion(props) {
    const { title, subtitle, paragraphs, links } = props;

    const [firstLink, secondLink] = links;

    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <Container py="xl" className="relative">
            <div ref={ref}>
                <div className="absolute inset-0 bg-gradient-to-br from-bg-bg-color via-primary-50 to-secondary-50" />
                <div className="relative mx-auto max-w-6xl px-4 py-24">
                    <motion.div
                        className="flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <motion.div
                            className="w-24 h-1 mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={isInView ? { width: 96 } : { width: 0 }}
                            transition={{ duration: 1.2, delay: 0.7 }}
                        />

                        <motion.h2
                            className="max-w-2xl mb-6 text-5xl font-semibold"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            {title}
                        </motion.h2>

                        <motion.p
                            className="mb-12 max-w-2xl text-lg text-text-color"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 1, delay: 1.1 }}
                        >
                            {stripTags(paragraphs[0])}
                        </motion.p>

                        <motion.div
                            className="flex gap-10 mt-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 1, delay: 1.3 }}
                        >
                            {firstLink && (
                                <div className="group">
                                    <Link to={firstLink.href}>
                                        <button className="px-8 py-4 rounded-full font-semibold border-2 border-primary-500 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-200">
                                            {firstLink.label}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="w-5 h-5 group-hover:translate-x-1 transition-transform text-inherit"
                                            >
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </Link>
                                </div>
                            )}

                            {secondLink && (
                                <div className="group">
                                    <Link to={secondLink.href}>
                                        <button className="px-8 py-4 rounded-full font-semibold border-2 border-secondary-500 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 btn-secondary">
                                            {secondLink.label}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="w-5 h-5 group-hover:translate-x-1 transition-transform text-inherit"
                                            >
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </Container>
    );
}
