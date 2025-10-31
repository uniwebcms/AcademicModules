// import { Warning } from '@uniwebcms/core-components';

// export default Warning;

import React from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import { SafeHtml } from '@uniwebcms/core-components';
import { LuInfo, LuCircleCheck, LuCircleX, LuTriangleAlert } from 'react-icons/lu';

const ALERT_CONFIG = {
    warning: {
        Icon: LuTriangleAlert,
        bgColor: "bg-[var(--bg-warning,theme('colors.yellow.50'))]",
        borderColor: "border-[var(--border-warning,theme('colors.yellow.300'))]",
        iconStyle: "text-[var(--text-warning,theme('colors.yellow.400'))]",
        textStyle: "!text-[var(--text-warning,theme('colors.yellow.700'))]",
    },
    success: {
        Icon: LuCircleCheck,
        bgColor: "bg-[var(--bg-success,theme('colors.green.50'))]",
        borderColor: "border-[var(--border-success,theme('colors.green.300'))]",

        iconStyle: "text-[var(--text-success,theme('colors.green.400'))]",
        textStyle: "!text-[var(--text-success,theme('colors.green.700'))]",
    },
    danger: {
        Icon: LuCircleX,
        bgColor: "bg-[var(--bg-danger,theme('colors.red.50'))]",
        borderColor: "border-[var(--border-danger,theme('colors.red.300'))]",

        iconStyle: "text-[var(--text-danger,theme('colors.red.400'))]",
        textStyle: "!text-[var(--text-danger,theme('colors.red.700'))]",
    },
    info: {
        Icon: LuInfo,
        bgColor: "bg-[var(--bg-info,theme('colors.blue.50'))]",
        borderColor: "border-[var(--border-info,theme('colors.blue.300'))]",
        iconStyle: "text-[var(--text-info,theme('colors.blue.400'))]",
        textStyle: "!text-[var(--text-info,theme('colors.blue.700'))]",
    },
};

export default function Callout(props) {
    // const { block } = props;

    // const { title, paragraphs } = block.getBlockContent();
    // const { type = 'info' } = block.getBlockProperties();

    const {
        attrs: { type },
        content,
        selected,
    } = props;

    const { Icon, bgColor, borderColor, iconStyle, textStyle } =
        ALERT_CONFIG[type] ?? ALERT_CONFIG.info;

    return (
        <div
            selected={selected}
            className={twJoin(
                'my-8 flex items-center gap-6 p-6 border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)]',
                bgColor,
                borderColor
            )}
        >
            <span className="flex-shrink-0 h-8 w-8 flex-none items-center justify-center">
                <Icon className={twJoin('h-8 w-8', iconStyle)} aria-hidden="true" />
            </span>
            <div className="flex flex-col">
                {/* {title ? (
                    <h3 className={twJoin('!my-0 text-xl lg:text-2xl', textStyle)}>{title}</h3>
                ) : null} */}
                <div className="prose">
                    <SafeHtml
                        value={content}
                        className={twJoin(textStyle)}

                        // className={twJoin(textStyle, '[&_p:last-child]:mb-2')}
                    />
                </div>
            </div>
        </div>
    );
}
