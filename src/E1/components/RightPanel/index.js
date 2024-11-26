import React, { useState } from 'react';
import ScrollspyNav from './ScrollNav';
import { CgMenuLeftAlt } from 'react-icons/cg';

const findScrollContainer = (element) => {
    if (!element) {
        return undefined;
    }

    let parent = element.parentElement;
    while (parent) {
        const { overflow } = window.getComputedStyle(parent);
        if (overflow.split(' ').every((o) => o === 'auto' || o === 'scroll')) {
            return parent;
        }
        parent = parent.parentElement;
    }

    return document.documentElement;
};

export default (props) => {
    const sidebarStyle = 'max-h-[calc(100vh-88px)] top-0 max-w-[220px] flex-1';

    const liStyle = 'text-rgba(92,105,117,1) [&_a.is-active]:text-[var(--active,#0d8287)]';

    const { website, page } = props;

    const cards = page.childBlocks?.filter((item) => !item.targetElement);
    const ids = cards.map((item) => `Section${item.id}`);

    const borderStyle = 'border-l-[1px] border-rgba(211,220,228,1.00)';

    const [scroller, setScroller] = useState(null);

    return (
        <div className={`w-[220px]`}>
            <div
                ref={(ref) => {
                    if (ref && !scroller) {
                        setScroller(findScrollContainer(ref));
                    }
                }}
                className={`block ${sidebarStyle} hidden md:fixed md:block flex-shrink-0 self-start top-[80px] overflow-auto`}
            >
                {ids.length ? (
                    <div className={`px-6 ${borderStyle} my-6`}>
                        <div className={`flex items-center mb-4 text-sm text-gray-500`}>
                            <CgMenuLeftAlt className={`w-5 h-5 mr-2`}></CgMenuLeftAlt>
                            <h3 className={`uppercase`}>
                                {website.localize({
                                    en: 'outline',
                                    fr: 'sommaire',
                                })}
                            </h3>
                        </div>
                        {scroller ? (
                            <ScrollspyNav
                                scrollTargetIds={[...ids]}
                                offset={-10}
                                activeNavClass="is-active"
                                scrollDuration="400"
                                scroller={scroller}
                            >
                                {cards.map((item, i) => {
                                    const { mainTitle, id } = item;

                                    return (
                                        <ul className={`mb-4 space-y-3 capitalize`} key={i}>
                                            <li
                                                className={`text-sm ${liStyle} hover:underline line-clamp-2`}
                                            >
                                                <a
                                                    className={`font-semibold`}
                                                    href={`#Section${id}`}
                                                >
                                                    {mainTitle}
                                                </a>
                                            </li>
                                        </ul>
                                    );
                                })}
                            </ScrollspyNav>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
