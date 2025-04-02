import React, { useState, useEffect, useRef } from 'react';
import Container from '../_utils/Container';
import { SafeHtml, Icon, stripTags } from '@uniwebcms/module-sdk';
import { HiCheck, HiChevronDown } from 'react-icons/hi';

const SelectWidget = ({ data, setData, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef(null);

    options = [{ value: '', label: placeholder }, ...options];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-full items-center justify-between rounded-md border pl-3 pr-8 text-sm placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-neutral-900 border-neutral-600 text-neutral-200"
            >
                {data || placeholder}
                <HiChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 rounded-md border border-neutral-600 bg-neutral-900 py-1">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`flex w-full items-center px-3 py-1.5 text-left text-sm ${
                                data === option.label
                                    ? 'bg-neutral-200 text-neutral-800 font-medium'
                                    : 'text-neutral-200 hover:bg-neutral-800'
                            }`}
                            onClick={() => {
                                setData(option.label);
                                setIsOpen(false);
                            }}
                        >
                            <span className="w-5">
                                {data === option.label && (
                                    <HiCheck className="h-4 w-4 text-neutral-800" />
                                )}
                            </span>
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Field = (props) => {
    const { title, paragraphs, properties, icons, lists, data, setData } = props;

    const icon = icons?.[0];

    const { widget = 'input' } = properties;

    const inputClassName =
        'flex h-10 w-full rounded-md border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-neutral-900 border-neutral-600 text-neutral-200 placeholder:text-neutral-500';

    const textareaClassName =
        'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:text-sm bg-neutral-900 border-neutral-600 text-neutral-200 placeholder:text-neutral-500';

    const placeholder = paragraphs?.[0] ? stripTags(paragraphs[0]) : '';

    return (
        <div>
            <label className="text-sm font-medium leading-none text-neutral-200 mb-2 flex items-center gap-2">
                {icon && <Icon icon={icon} className="w-4 h-4 text-inherit" />}
                {title}
            </label>
            {widget === 'input' ? (
                <input
                    className={inputClassName}
                    placeholder={placeholder}
                    value={data[title] || ''}
                    onChange={(e) => setData({ ...data, [title]: e.target.value })}
                />
            ) : null}
            {widget === 'textarea' ? (
                <textarea
                    className={textareaClassName}
                    placeholder={placeholder}
                    value={data[title] || ''}
                    onChange={(e) => setData({ ...data, [title]: e.target.value })}
                />
            ) : null}
            {widget === 'select' ? (
                <SelectWidget
                    data={data[title] || ''}
                    setData={(value) => setData({ ...data, [title]: value })}
                    options={lists[0].map((item) => ({
                        value: item.paragraphs[0],
                        label: item.paragraphs[0],
                    }))}
                    placeholder={placeholder}
                />
            ) : null}
            {widget === 'radio' ? (
                <div role="radiogroup" className="grid gap-2 space-y-2 mt-4">
                    {lists[0].map((item, index) => (
                        <label key={index} className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name={title}
                                value={item.paragraphs[0]}
                                checked={data[title] === item.paragraphs[0]}
                                onChange={(e) => setData({ ...data, [title]: e.target.value })}
                            />
                            {item.paragraphs[0]}
                        </label>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default function Form(props) {
    const { block } = props;

    const { title, subtitle, buttons } = block.getBlockContent();

    const items = block.getBlockItems();

    const [data, setData] = useState({});

    useEffect(() => {
        const initData = {};

        items.forEach((item) => {
            const { title, properties } = item;

            if (properties?.['default']) {
                initData[title] = properties['default'];
            } else {
                initData[title] = '';
            }
        });

        setData(initData);
    }, [items.length]);

    return (
        <Container
            px="none"
            py="none"
            className="bg-neutral-800 rounded-lg border border-neutral-700 shadow-xl overflow-hidden"
        >
            {title || subtitle ? (
                <div className="flex flex-col space-y-1.5 p-6 border-b border-neutral-700">
                    {title && <h2 className="font-semibold tracking-tight text-2xl">{title}</h2>}
                    {subtitle && <p className="text-sm">{subtitle}</p>}
                </div>
            ) : null}
            {items.length ? (
                <form className="p-6 space-y-6">
                    {items.map((item, index) => (
                        <Field key={index} {...item} data={data} setData={setData} />
                    ))}
                    {buttons[0] && (
                        <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-10 px-4 py-2 w-full"
                        >
                            {buttons[0].content}
                        </button>
                    )}
                </form>
            ) : null}
        </Container>
    );
}
