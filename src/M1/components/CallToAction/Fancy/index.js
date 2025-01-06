import React from 'react';
import Container from '../../_utils/Container';
import { twJoin, SafeHtml, Link, stripTags } from '@uniwebcms/module-sdk';
import { motion, useInView } from 'framer-motion';

const containerBgDefault = 'bg-bg-color';
const containerBgOcean = 'bg-slate-900';

const containerBgGradientColorDefault = 'from-bg-color via-primary-50 to-bg-color';
const containerBgGradientColorOcean = 'from-blue-950 via-slate-900 to-slate-900';

const containerBgHalationLeftColorDefault = 'bg-primary-50';
const containerBgHalationLeftColorOcean = 'bg-blue-500/20';

const containerBgHalationRightColorDefault = 'bg-primary-50';
const containerBgHalationRightColorOcean = 'bg-orange-500/10';

const containerBgHalationCenterColorDefault = 'bg-primary-100';
const containerBgHalationCenterColorOcean = 'bg-blue-400/5';

const floatingParticleColorDefault = 'bg-primary-50';
const floatingParticleColorOcean = 'bg-blue-500/50';

const iconColorBgDefault = 'bg-primary-50';
const iconColorBgOcean = 'bg-blue-500/10';

const iconColorDefault = 'text-primary-600';
const iconColorOcean = 'text-blue-500';

const titleStyleDefault = '';
const titleStyleOcean = 'from-white via-blue-100 to-white text-transparent';

const textColorDefault = 'text-text-color-60';
const textColorOcean = 'text-slate-400';

const firstLinkStyleDefault = 'bg-primary-600 hover:bg-primary-500 text-white';
const firstLinkStyleOcean = 'bg-blue-600 hover:bg-blue-700 text-white';

const secondLinkStyleDefault = 'bg-text-color/10 hover:bg-text-color/20 text-text-color';
const secondLinkStyleOcean = 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700/50';

const FloatingParticle = ({ uiPreset, className = '' }) => (
    <div
        className={twJoin(
            'absolute w-1 h-1 rounded-full animate-float',
            className,
            uiPreset === 'ocean' ? floatingParticleColorOcean : floatingParticleColorDefault
        )}
    ></div>
);

function Ocean(props) {
    const { title, subtitle, paragraphs, links, uiPreset } = props;

    const [firstLink, secondLink] = links;

    return (
        <Container px="none" py="lg" className={twJoin('relative', containerBgOcean)}>
            <div className="absolute inset-0">
                <div
                    className={twJoin(
                        'absolute inset-0 bg-gradient-to-br',
                        containerBgGradientColorOcean
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse',
                        containerBgHalationLeftColorOcean
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse delay-1000',
                        containerBgHalationRightColorOcean
                    )}
                ></div>
                <div
                    className={twJoin(
                        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl animate-pulse delay-500',
                        containerBgHalationCenterColorOcean
                    )}
                ></div>
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                ></div>
                <FloatingParticle className="top-1/4 left-1/4" uiPreset={uiPreset} />
                <FloatingParticle className="top-3/4 left-1/3 delay-1000" uiPreset={uiPreset} />
                <FloatingParticle className="top-1/3 right-1/4 delay-2000" uiPreset={uiPreset} />
                <FloatingParticle className="bottom-1/4 right-1/3 delay-3000" uiPreset={uiPreset} />
                <FloatingParticle className="top-1/2 left-1/2 delay-4000" uiPreset={uiPreset} />
            </div>
            <div className="relative max-w-4xl mx-auto px-8 text-center">
                <div
                    className={twJoin(
                        'inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 transform hover:rotate-12 transition-all duration-300 group',
                        iconColorBgOcean
                    )}
                >
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
                        className={twJoin(
                            'lucide lucide-sparkles h-10 w-10 transform group-hover:scale-110 transition-transform duration-300',
                            iconColorOcean
                        )}
                    >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                    </svg>
                </div>
                <h2
                    className={twJoin(
                        'text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text animate-gradient-x',
                        titleStyleOcean
                    )}
                >
                    {title}
                </h2>
                <SafeHtml value={paragraphs} className={twJoin('text-lg mb-12', textColorOcean)} />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {firstLink && (
                        <Link
                            to={firstLink.href}
                            className={twJoin(
                                'group relative px-8 py-4 rounded-xl font-medium transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg overflow-hidden',
                                firstLinkStyleOcean
                            )}
                        >
                            <span className="flex items-center">
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
                                    className="lucide lucide-arrow-right ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300 text-inherit"
                                >
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </span>
                        </Link>
                    )}
                    {secondLink && (
                        <Link
                            to={secondLink.href}
                            className={twJoin(
                                'px-8 py-4 rounded-xl font-medium border backdrop-blur-sm transform transition-all duration-300 hover:translate-y-[-2px]',
                                secondLinkStyleOcean
                            )}
                        >
                            {secondLink.label}
                        </Link>
                    )}
                </div>
            </div>
        </Container>
    );
}

export default function Fancy(props) {
    const { title, subtitle, paragraphs, links, uiPreset } = props;

    const [firstLink, secondLink] = links;

    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    if (uiPreset === 'ocean') {
        return <Ocean {...{ title, subtitle, paragraphs, links, uiPreset }} />;
    }

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
                            className="mb-12 max-w-2xl text-lg text-text-color-60"
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
                                    <Link
                                        to={firstLink.href}
                                        className="px-8 py-4 rounded-full font-semibold text-bg-color border-2 border-primary-600 bg-primary-600 hover:bg-primary-700 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-200"
                                    >
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
                                    </Link>
                                </div>
                            )}

                            {secondLink && (
                                <div className="group">
                                    <Link
                                        to={secondLink.href}
                                        className="px-8 py-4 rounded-full font-semibold text-secondary-600 border-2 border-secondary-600 hover:bg-secondary-50 flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
                                    >
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

// const Rainbow = ({ title, subtitle, paragraphs, links }) => {
//     const [firstLink, secondLink] = links;

//     return (
//         <Container py="xl" px="none" className="relative w-screen">
//             <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-orange-50 to-orange-50"></div>
//             <div className="relative mx-auto max-w-6xl px-4 py-24">
//                 <div className="flex flex-col items-center text-center">
//                     <h2 className="max-w-2xl mb-6 text-5xl font-semibold bg-gradient-to-r from-orange-500 via-blue-400 to-blue-500 bg-clip-text text-transparent">
//                         {title}
//                     </h2>
//                     <SafeHtml
//                         value={paragraphs}
//                         className="mb-12 max-w-2xl text-lg text-gray-700"
//                     />
//                     <div className="flex gap-10 mt-16">
//                         {firstLink && (
//                             <div className="relative group">
//                                 <div className="absolute -inset-px bg-gradient-to-r from-orange-500 to-blue-500 rounded-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-300"></div>
//                                 <div className="relative p-[2px] bg-gradient-to-r from-orange-500 to-blue-500 rounded-full">
//                                     <Link
//                                         to={firstLink.href}
//                                         className="relative px-8 py-4 rounded-full font-semibold text-white flex items-center gap-2 transition duration-300 hover:scale-105 backdrop-blur-lg"
//                                     >
//                                         {firstLink.label}
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             width="24"
//                                             height="24"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             className="w-5 h-5 group-hover:translate-x-1 transition-transform text-inherit"
//                                         >
//                                             <path d="M5 12h14"></path>
//                                             <path d="m12 5 7 7-7 7"></path>
//                                         </svg>
//                                     </Link>
//                                 </div>
//                             </div>
//                         )}
//                         {secondLink && (
//                             <div className="relative group">
//                                 <div className="absolute -inset-px bg-gradient-to-r from-orange-400 to-orange-300 rounded-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-300"></div>
//                                 <div className="relative p-[2px] bg-gradient-to-r from-orange-100 to-orange-50 rounded-full">
//                                     <Link
//                                         to={secondLink.href}
//                                         className="relative px-8 py-4 rounded-full font-semibold text-orange-500 flex items-center gap-2 transition duration-300 hover:scale-105 backdrop-blur-lg"
//                                     >
//                                         {secondLink.label}
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             width="24"
//                                             height="24"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             className="w-5 h-5 group-hover:translate-x-1 transition-transform text-inherit"
//                                         >
//                                             <path d="M5 12h14"></path>
//                                             <path d="m12 5 7 7-7 7"></path>
//                                         </svg>
//                                     </Link>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </Container>
//     );
// };
