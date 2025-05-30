import React, { useState } from 'react';
import Container from '../_utils/Container';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { SafeHtml, Icon } from '@uniwebcms/core-components';
import { LuInfo } from 'react-icons/lu';
import { HiX } from 'react-icons/hi';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Label,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const CustomXAxisTick = ({ x, y, payload }) => {
    const labels = {
        25: 'Complex',
        50: '',
        75: '',
        100: 'Simple',
    };
    return (
        <text
            x={x === 100 ? x + 20 : x - 25}
            y={y + 20}
            textAnchor="middle"
            fill="#4B5563"
            fontSize={14}
        >
            {labels[payload.value]}
        </text>
    );
};

const Chart = ({ data, settings }) => {
    const { xAxis, yAxis, scatters } = settings;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 40 }}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                <XAxis
                    type="number"
                    dataKey="x"
                    domain={xAxis.domain}
                    reversed
                    ticks={xAxis.ticks}
                    tick={<CustomXAxisTick />}
                    stroke="#6B7280"
                >
                    <Label
                        value={xAxis.label}
                        offset={-20}
                        position="insideBottom"
                        style={{ fill: '#4B5563', fontWeight: 500 }}
                    />
                </XAxis>

                <YAxis
                    type="number"
                    dataKey="y"
                    domain={yAxis.domain}
                    ticks={yAxis.ticks}
                    tick={{ transform: 'translate(-5, 0)', fill: '#4B5563', fontSize: 14 }}
                    stroke="#6B7280"
                    tickFormatter={(value) => {
                        return yAxis.ticksLabel[yAxis.ticks.indexOf(value)];
                    }}
                >
                    <Label
                        value={yAxis.label}
                        angle={-90}
                        position="insideLeft"
                        style={{ fill: '#4B5563', fontWeight: 500 }}
                        dx={10}
                        dy={50}
                    />
                </YAxis>

                {/* Category-specific scatters */}
                {scatters.map((scatter, index) => {
                    const { name, color, shape } = scatter;

                    return (
                        <Scatter
                            key={index}
                            name={name}
                            data={data.scatters.filter((c) => c.category === name)}
                            fill={color}
                            shape={shape}
                            filter="url(#glow)"
                        />
                    );
                })}

                {/* Scatter tooltip */}
                <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;

                            return (
                                <div className="bg-neutral-50 p-4 border border-neutral-200 shadow-lg rounded-lg max-w-xs">
                                    <p className="font-bold mb-2">{data.title}</p>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="font-medium text-secondary-600">
                                                {xAxis.label}:
                                            </span>
                                            <br />({100 - data.x}/100)
                                        </p>
                                        <p>
                                            <span className="font-medium text-primary-600">
                                                {yAxis.label}:
                                            </span>
                                            <br />({data.y}/100)
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

const TooltipFeatureItem = ({ item, isAxisItem = true }) => {
    const { title, lists, paragraphs } = item;

    const xAxisFeatures = lists[0]?.map((item) => {
        return {
            title: item.paragraphs?.[0],
            description: item.lists?.[0]?.[0]?.paragraphs?.[0],
        };
    });

    return (
        <div className="flex-1">
            <h4
                className={twJoin(
                    'font-semibold mb-2 flex items-center gap-2',
                    isAxisItem ? 'text-secondary-500' : 'text-primary-500'
                )}
            >
                {title}
                <span className="text-sm font-normal text-neutral-500">
                    {isAxisItem ? `(X-axis)` : `(Y-axis)`}
                </span>
            </h4>
            <div className="space-y-2">
                {xAxisFeatures.map((feature, index) => (
                    <div
                        key={index}
                        className={twJoin(
                            'py-1.5 px-2 rounded border',
                            isAxisItem
                                ? 'bg-secondary-50/50 border-secondary-100/50'
                                : 'bg-primary-50/50 border-primary-100/50'
                        )}
                    >
                        <p className="text-sm font-medium text-neutral-800">{feature.title}</p>
                        <p className="text-xs text-neutral-600">{feature.description}</p>
                    </div>
                ))}
                <SafeHtml value={paragraphs[0]} className="text-xs text-neutral-500 mt-1" />
            </div>
        </div>
    );
};

const TooltipBlock = ({ block, triggerText }) => {
    const { title, subtitle } = block.getBlockContent();
    const items = block.getBlockItems();

    const [isOpen, setIsOpen] = useState(false);

    const [xAxis, yAxis] = items;

    return (
        <>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-[-16px] right-2 p-2 flex items-center gap-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors duration-200 cursor-pointer"
            >
                <LuInfo className="w-[18px] h-[18px] text-inherit" />
                <span className="text-sm font-medium">{triggerText}</span>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm rounded-xl z-30"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-12 right-2 w-[640px] bg-neutral-50/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-neutral-200/50 z-40"
                        >
                            {/* Header */}
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
                                <p className="text-sm text-neutral-600">{subtitle}</p>
                            </div>

                            {/* Two-column layout */}
                            <div className="flex gap-6">
                                {xAxis && <TooltipFeatureItem item={xAxis} isAxisItem={true} />}
                                {yAxis && <TooltipFeatureItem item={yAxis} isAxisItem={false} />}
                            </div>

                            {/* Close Button */}
                            <div
                                onClick={() => setIsOpen(!isOpen)}
                                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                            >
                                <HiX className="w-4 h-4 text-inherit" />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

const parseItems = (items) => {
    const parsed = [];

    items.forEach((item) => {
        const { title, icons, properties } = item;

        const icon = icons[0];

        const { scatters, category } = properties;

        const parsedScatters = scatters.map((scatter) => {
            const { name, x, y } = scatter;

            return {
                title: name,
                x,
                y,
                category,
            };
        });

        parsed.push({
            title,
            icon,
            scatters: parsedScatters,
        });
    });

    // merge scatters in to a all scatters, title is 'All', icon is allIcon
    const merged = parsed.reduce((acc, cur) => {
        return {
            title: website.localize({
                en: 'All',
                fr: 'Tous',
                es: 'Todos',
                zh: '全部',
            }),
            icon: allIcon,
            scatters: [...acc.scatters, ...cur.scatters],
        };
    });

    return [merged, ...parsed];
};

const allIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>`;

export default function DataVizCompare(props) {
    const { block } = props;

    const { properties: settings } = block.getBlockContent();
    const items = block.getBlockItems();

    const [activeChartIndex, setActiveChartIndex] = React.useState(0);

    const data = parseItems(items, settings);

    const chartSwitcherBtnClassName =
        'px-2.5 py-1.5 lg:px-4 lg:py-2 xl:px-6 xl:py-3 rounded-full flex items-center gap-2 backdrop-blur-sm transition-all duration-300 shadow-lg bg-neutral-100/50 hover:bg-neutral-100/80 text-neutral-700 cursor-pointer hover:scale-105';
    const chartSwitcherActiveBtnClassName =
        'px-2.5 py-1.5 lg:px-4 lg:py-2 xl:px-6 xl:py-3 rounded-full flex items-center gap-2 backdrop-blur-sm transition-all duration-300 shadow-lg bg-gradient-to-r from-secondary-600 to-secondary-500 text-neutral-50 shadow-secondary-500/50 cursor-pointer';

    const { childBlocks } = block;

    const tooltipBlock =
        settings.tooltip?.contentSource === 'child_section' && childBlocks[0]
            ? childBlocks[0]
            : null;

    return (
        <Container px="none" py="none" className="relative max-w-8xl w-full mx-auto p-4">
            <div className="w-full backdrop-blur-xl bg-neutral-100/70 rounded-xl shadow-2xl p-8 border border-neutral-100/20">
                {/* chart switcher btn group */}
                <div className="flex gap-4 mb-8 pb-4 justify-center">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className={twJoin(
                                activeChartIndex === index
                                    ? chartSwitcherActiveBtnClassName
                                    : chartSwitcherBtnClassName
                            )}
                            onClick={() => setActiveChartIndex(index)}
                        >
                            <Icon icon={item.icon} className="w-[18px] h-[18px] text-inherit" />
                            {item.title}
                        </div>
                    ))}
                </div>

                {/* chart */}
                <div className="relative h-[500px] bg-neutral-50/40 rounded-lg p-4 backdrop-blur-sm border border-neutral-50/50">
                    {/* tooltip */}
                    {tooltipBlock && (
                        <TooltipBlock
                            block={tooltipBlock}
                            triggerText={settings.tooltip.triggerText}
                        />
                    )}
                    <Chart data={data[activeChartIndex]} settings={settings} />
                </div>
            </div>
        </Container>
    );
}
