import React from 'react';
import Searchbar from '../_utils/Searchbar';
import { Link } from '@uniwebcms/module-sdk';
import LangSwitch from '../_utils/LangSwitch';

export default function (props) {
    const {
        website,
        block: { title },
    } = props;

    return (
        <div className={`relative flex flex-grow w-full items-center justify-beeen h-16`}>
            <div className={`flex items-center px-2 lg:px-7 w-12 sm:w-36 xl:w-80 justify-start`}>
                <div className={`flex-shrink-0 flex items-center`}>
                    <span className={`text-gray-800 text-lg font-semibold ml-6 hidden lg:inline`}>
                        {title}
                    </span>
                </div>
            </div>
            <div className={`flex-1 flex justify-center lg:justify-start`}>
                <Searchbar {...props}></Searchbar>
            </div>
            <div className={`w-72 xl:w-80 hidden lg:flex`}>
                <LangSwitch website={website} />
                <Link
                    className={`py-2 px-4 text-sm text-white bg-blue-500 hover:bg-blue-700 cursor-pointer rounded flex items-center`}
                    to="/network"
                >
                    {website.localize({
                        en: 'Explore full network',
                        fr: 'Explorer le réseau complet',
                    })}
                </Link>
            </div>
        </div>
    );
}
