import { Link } from '@uniwebcms/module-sdk';
import { HiChevronRight, HiChevronDown } from 'react-icons/hi';
import React, { useState } from 'react';

const hasActiveFolder = (folder, activeId) => {
    let subFolders = (folder.sortedProfiles || []).filter((profile) => profile.folder);

    for (let i = 0; i < subFolders.length; i++) {
        if (subFolders[i].folder.fileId.toString() === activeId || hasActiveFolder(subFolders[i].folder, activeId)) {
            return true;
        }
    }

    return false;
};

const initOpens = (folder, activeId, opens) => {
    if (folder.fileId) opens[folder.fileId] = hasActiveFolder(folder, activeId);

    let subFolders = (folder.sortedProfiles || []).filter((profile) => profile.folder);

    subFolders.forEach((profile) => {
        initOpens(profile.folder, activeId, opens);
    });
};

const Menus = ({ files, level = 1, opens, setOpens, activeId }) => {
    const folerProfiles = files.filter((profile) => profile.folder);

    if (!folerProfiles.length) return null;

    const body = [];

    const paddingLeft = 12 * level + 'px';

    let textColor = 'text-gray-500 hover:text-gray-900 hover:bg-gray-50';

    folerProfiles.forEach(({ folder }) => {
        const { name, fileId, sortedProfiles } = folder;

        const subFolders = sortedProfiles.filter((profile) => profile.folder);

        let opened = opens?.[fileId];

        let iconMarkup = subFolders.length ? (
            opened ? (
                <HiChevronDown className='h-5 w-5 text-gray-400 hover:text-gray-600'></HiChevronDown>
            ) : (
                <HiChevronRight className='h-5 w-5 text-gray-400 hover:text-gray-600'></HiChevronRight>
            )
        ) : null;

        let liTextClass =
            fileId.toString() === activeId
                ? 'bg-blue-50 hover:bg-blue-100 text-gray-600 hover:text-gray-900'
                : textColor;

        body.push(
            <li key={fileId}>
                <Link to={fileId}>
                    <div
                        className={`items-center pr-3 py-2 transition-colors duration-100 relative flex ${liTextClass} cursor-pointer hover:underline `}
                        style={{
                            paddingLeft
                        }}>
                        <span className='rounded-md absolute inset-0 opacity-0 z-[-10]'></span>
                        <span className='relative font-medium'>{name}</span>
                        {subFolders.length ? (
                            <div
                                className='flex-shrink-0 ml-auto'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOpens({
                                        ...opens,
                                        [fileId]: !opens?.[fileId]
                                    });
                                }}>
                                {iconMarkup}
                            </div>
                        ) : null}
                    </div>
                </Link>
            </li>
        );

        if (subFolders.length && opened) {
            body.push(
                <li key={`${fileId}_files`}>
                    <Menus level={level + 1} files={subFolders} {...{ opens, setOpens, activeId }}></Menus>
                </li>
            );
        }
    });

    return <ul>{body}</ul>;
};

export default function (props) {
    const {
        website,
        input,
        block: { title }
    } = props;

    const { useParams } = website.getRoutingComponents();

    const params = useParams();

    const activeId = params['*'];

    const folder = input.profile.folder;

    let startOpens = {};

    initOpens(folder, activeId, startOpens);

    const [opens, setOpens] = useState(startOpens);

    return (
        <div className={`w-[320px] lg:w-80 bg-white overflow-hidden ml-[-1px]`}>
            <div className='pt-6 h-full pb-0 flex flex-col'>
                <h2 className='text-sm font-semibold px-8 flex justify-between'>
                    <span className='uppercase text-gray-600'>{title}</span>
                    <Link to={``} className='font-normal cursor-pointer hover:underline text-gray-600'>
                        {website.localize({ en: 'All', fr: 'Tout' })}
                    </Link>
                </h2>
                <div className='sticky flex-1'>
                    <div className='flow-root overflow-y-auto px-8 py-6'>
                        <Menus files={folder.sortedProfiles} {...{ opens, setOpens, activeId }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
