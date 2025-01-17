import React, { useState } from 'react';

import Preview from './Preview';
import Panel from './Panel';

export default function ProductCatalog(props) {
    const { input, website } = props;

    const [screen, setScreen] = useState('desktop');

    const profile = input.profile;
    let handle = profile ? profile.getHandle() || profile.getId() : '';

    let src = `/sites/${handle}`;

    const boxStyle =
        'w-[20rem] rounded-md h-full bg-white pointer-events-none flex overflow-hidden transform transition ease-in-out duration-500 shadow border';

    return (
        <div className="relative w-screen flex bg-gray-50 max-w-full flex-grow py-6 h-screen gap-5 px-5 sm:px-6 md:px-8">
            {/* <div className="flex flex-grow md:space-x-5 px-5 sm:px-6 md:px-8 2xl:max-w-[1536px] justify-center xl:mx-auto max-w-full mx-0"> */}
            <div className={`${boxStyle}`}>
                <div className="pointer-events-auto w-full transition flex-shrink-0">
                    <Panel profile={profile} website={website} input={input}></Panel>
                </div>
            </div>
            <Preview iframeSrc={src} {...{ screen }} />
            {/* </div> */}
        </div>
    );
    // return (
    //     <div
    //         className={`text-lg text-blue-500 cursor-pointer`}
    //         onClick={() => {
    //             fetch('http://127.0.0.1:8002/temp_resource.php', {
    //                 method: 'POST', // HTTP method
    //                 headers: {
    //                     'Content-Type': 'application/json', // Specify content type
    //                 },
    //                 body: JSON.stringify({
    //                     action: 'store',
    //                     data: {
    //                         templateSite: 168,
    //                     },
    //                 }), // Convert data object to JSON string
    //             })
    //                 .then((response) => {
    //                     if (!response.ok) {
    //                         throw new Error(`HTTP error! status: ${response.status}`);
    //                     }
    //                     return response.json(); // Parse the JSON response
    //                 })
    //                 .then((data) => {
    //                     window.location.replace(data);
    //                 })
    //                 .catch((error) => {
    //                     console.error('Error:', error); // Handle any errors
    //                 });
    //         }}
    //     >
    //         Click it to create the website
    //     </div>
    // );
}
