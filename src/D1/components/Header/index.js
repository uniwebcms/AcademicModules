import React from 'react';
import Search from './SiteSearch';
import LangSwitch from './LangSwitch';

export default function (props) {
    const {
        block: { title },
        website,
    } = props;

    const activeLang = website.getLanguage();

    return (
        <div
            className={`relative flex border-b shadow-[0px_4px_10px_rgb(0,0,0, 0.05)] h-[80px] items-center pl-10`}
        >
            <div className={`flex items-center`}>
                <h1 className={`text-base md:text-2xl font-bold`}>{title}</h1>
            </div>
            <div className={`flex items-center ml-auto`}>
                <LangSwitch website={website} activeLang={activeLang} />
            </div>
            <div className="w-[220px] xl:w-[280px] border-l pl-6 flex items-center">
                <Search {...props} />
            </div>
        </div>
    );
}
