import React from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { website } from '@uniwebcms/module-sdk';
import MetaInfo from './MetaInfo';

export default function (props) {
    const { styler, onClose } = props;

    const { title, description } = styler;

    return (
        <div className="h-full w-full flex flex-col bg-neutral-50 px-4 pt-4 pb-8 gap-y-4">
            <div
                className="flex items-center space-x-1 cursor-pointer text-neutral-600 hover:text-neutral-900"
                onClick={onClose}
            >
                <HiArrowLeft className="w-4 h-4 text-inherit" />
                <span>
                    {website.localize({
                        en: 'All Foundations',
                        fr: 'Toutes les fondations',
                        es: 'Todas las fundaciones',
                        zh: '查看所有',
                    })}
                </span>
            </div>
            <div className="flex-grow">
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="mt-3 text-sm text-neutral-600">{description}</p>
                <MetaInfo styler={styler}></MetaInfo>
            </div>
            <div className="w-full">
                <p className="text-neutral-900 font-semibold mb-2">
                    {website.localize({
                        en: 'Use this component system',
                        fr: 'Utilisez ce système de composants',
                        es: 'Utilice este sistema de componentes',
                        zh: '使用此组件系统',
                    })}
                </p>
                <button className="w-full px-4 py-4 bg-neutral-950 text-neutral-50 hover:bg-neutral-800 rounded-md text-sm mb-1">
                    {website.localize({
                        en: 'Start From Scratch',
                        fr: 'Commencer de zéro',
                        es: 'Empezar desde cero',
                        zh: '从头开始',
                    })}
                </button>
                <button className="w-full px-4 py-4 bg-neutral-950 text-neutral-50 hover:bg-neutral-800 rounded-md text-sm">
                    {website.localize({
                        en: 'View Templates',
                        fr: 'Voir les modèles',
                        es: 'Ver plantillas',
                        zh: '查看模板',
                    })}
                </button>
            </div>
        </div>
    );
}
