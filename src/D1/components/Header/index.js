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
        <div className={`w-screen h-20 relative border-b`}>
            <div className="w-full h-full max-w-8xl mx-auto flex justify-between items-center px-8 md:px-12">
                <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold`}>{title}</h1>
                {/* <div className={`flex items-center ml-auto`}>
                <LangSwitch website={website} activeLang={activeLang} />
            </div>
            <div className="w-[220px] xl:w-[280px] border-l pl-6 flex items-center">
                <Search {...props} />
            </div> */}
                <div className="flex items-center space-x-4">
                    <LangSwitch website={website} activeLang={activeLang} />
                    <div className="w-px h-6 bg-gray-200" />
                    <Search {...props} />
                </div>
            </div>
        </div>
    );
}
