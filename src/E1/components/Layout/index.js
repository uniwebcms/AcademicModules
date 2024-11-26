import React from 'react';

export default function (props) {
    const { header, body, leftPanel } = props;

    return (
        <div className={`relative min-h-screen flex flex-col overflow-hidden`}>
            <nav
                className={`flex-shrink-0 bg-white border-b border-[rgba(131,21,48,0.8)]`}
            >
                {header}
            </nav>
            <div className={`flex-grow w-full flex`}>
                <div className={`flex-1 min-w-0 bg-white lg:flex`}>
                    <div
                        className={`transition-transform -translate-x-full lg:translate-x-0 transform z-10 absolute !shadow-lg lg:static lg:!shadow-none flex lg:flex-shrink-0 w-[300px] lg:w-80 lg:border-r lg:border-gray-200 bg-white justify-center`}
                    >
                        {leftPanel}
                    </div>
                    <div className="bg-white lg:min-w-0 lg:flex-1 flex flex-col">
                        {body}
                    </div>
                </div>
            </div>
        </div>
    );
}
