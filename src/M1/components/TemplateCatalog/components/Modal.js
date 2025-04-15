import React from 'react';
import { Dialog } from '@headlessui/react';
import { HiX } from 'react-icons/hi';
import { twJoin, Link } from '@uniwebcms/module-sdk';
import { LuLayers2, LuCrown, LuGem, LuBlocks } from 'react-icons/lu';

const icons = {
    layer: LuLayers2,
    crown: LuCrown,
    gem: LuGem,
    block: LuBlocks,
};

export default function Modal(props) {
    const {
        triggerText,
        triggerClassName,
        title,
        subtitle,
        examples,
        tagEndnote,
        button,
        theme,
        style,
    } = props;

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const buttonGroup = Array.isArray(button) ? button : [button];

    return (
        <>
            <span
                aria-label="Open Modal"
                onClick={() => setDialogOpen(true)}
                className={triggerClassName}
            >
                {triggerText}
            </span>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                className={twJoin('relative z-50 focus:outline-none', theme)}
                style={style}
            >
                <div className="fixed inset-0 z-50 bg-black/80"></div>
                <Dialog.Panel className="fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] border px-6 py-6 md:px-8 md:py-8 xl:px-12 xl:py-8 shadow-lg sm:rounded-lg max-w-3xl rounded-xl bg-neutral-50 border-neutral-400 transform transition-transform duration-300 ease-in-out">
                    <div
                        className="absolute top-4 right-4 cursor-pointer"
                        onClick={() => setDialogOpen(false)}
                    >
                        <HiX className="w-6 h-6 text-neutral-500 hover:text-neutral-600" />
                    </div>
                    {/* title */}
                    <div className="flex flex-col text-center mb-5">
                        <h2 className="font-medium tracking-tight text-3xl mb-5">{title}</h2>
                        <p className="text-neutral-600">{subtitle}</p>
                    </div>
                    {/* examples */}
                    <div className="space-y-5">
                        {examples.map((example, index) => {
                            const { icon, title, tag, description } = example;
                            const Icon = icons[icon];
                            return (
                                <div
                                    key={index}
                                    className="p-6 rounded-xl bg-neutral-100 border border-neutral-300"
                                >
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <div className="flex items-center gap-3">
                                            {Icon ? (
                                                <Icon className="w-5 h-5 text-neutral-800" />
                                            ) : null}
                                            <h3 className="text-lg font-semibold text-neutral-900">
                                                {title}
                                            </h3>
                                        </div>
                                        <div className="text-neutral-800 tracking-wider">
                                            {tag}
                                            {tagEndnote ? '*' : ''}
                                        </div>
                                    </div>
                                    <p className="text-neutral-600 leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    {tagEndnote && (
                        <div className="mt-8 text-center text-neutral-500">*{tagEndnote}</div>
                    )}
                    {/* button */}
                    <div className="flex justify-center mt-8 gap-x-6">
                        {buttonGroup.map((button, index) => {
                            const { label, action, url } = button;

                            const Wrapper = action === 'link' ? Link : 'div';
                            const wrapperProps =
                                action === 'link'
                                    ? { to: url }
                                    : action === 'close'
                                    ? { onClick: () => setDialogOpen(false) }
                                    : {};

                            return (
                                <Wrapper key={index} {...wrapperProps}>
                                    <button
                                        className={twJoin(
                                            'px-6 py-3 font-medium rounded-md focus:outline-none ring-0 focus:ring-2 ring-offset-2',
                                            index % 2 === 0
                                                ? 'ring-[var(--btn-color)]'
                                                : 'btn-secondary ring-transparent border border-neutral-400'
                                        )}
                                    >
                                        {label}
                                    </button>
                                </Wrapper>
                            );
                        })}
                    </div>
                </Dialog.Panel>
            </Dialog>
        </>
    );
}
