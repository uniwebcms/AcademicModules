import React from 'react';
import { website } from '@uniwebcms/module-sdk';
import { LuCrown, LuLayers2 } from 'react-icons/lu';
import { GrDiamond } from 'react-icons/gr';

export default function ({ styler }) {
    let { type = 'essential', creator = 'Uniweb Studio' } = styler;

    let icon,
        label,
        iconClass = 'w-6 h-6 text-neutral-300 lg:text-neutral-600';
    if (type === 'essential') {
        label = website.localize({ en: 'Essential Library', fr: 'Bibliothèque essentielle' });
        icon = <LuLayers2 className={iconClass} />;
    } else if (type === 'advanced') {
        label = website.localize({ en: 'Advanced Library', fr: 'Bibliothèque avancée' });
        icon = <LuCrown className={iconClass} />;
    } else if (type === 'signature') {
        label = website.localize({ en: 'Signature Library', fr: 'Bibliothèque signature' });
        icon = <GrDiamond className={iconClass} />;
    }

    return (
        <div className="my-4 lg:my-6 bg-neutral-800 lg:bg-neutral-200/75 rounded-lg border border-neutral-600 lg:border-neutral-300">
            <div className="flex flex-col p-3 lg:p-4">
                <div className={`flex items-center gap-3`}>
                    {icon}
                    <div className={`flex flex-col`}>
                        <p className={`font-medium text-sm text-neutral-200 lg:text-neutral-800`}>
                            {label}
                        </p>
                        <p className={`text-xs text-neutral-400 lg:text-neutral-500`}>
                            {website.localize({
                                en: `by ${creator}`,
                                fr: `par ${creator}`,
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
