import React, { useState } from 'react';
import FrameLoader from './FrameLoader';

export default function (props) {
    const { iframeSrc, screen } = props;
    const iframeSize =
        screen === 'desktop'
            ? `w-full h-full !shadow bg-white  transform` //`w-full h-full shadow-none transform`
            : 'w-[320px] h-[566px] border !shadow-xl rounded';

    // const [h, setH] = useState('');
    // const [w, setW] = useState('');
    // const [scale, setScale] = useState('');

    // let frameStyle = {};

    // if (h) frameStyle.height = h;
    // if (w) frameStyle.width = w;
    // if (scale) frameStyle.transform = `scale(${scale})`;

    return (
        <div
            className={`rounded-md flex-1 h-full flex items-center justify-center overflow-hidden relative bg-black`}
            style={{ outline: '1px solid rgb(100,100,100)' }}
            // ref={(ref) => {
            //     if (ref) {
            //         const scale = ref.scrollWidth / 1425;

            //         const h = (100 / scale).toFixed(2);

            //         setH(`${h}%`);
            //         setW('1425px');
            //         setScale(scale);
            //     }
            // }}
        >
            <FrameLoader
                src={iframeSrc}
                className={`${iframeSize}`}
                // style={screen === 'desktop' ? frameStyle : {}}
            ></FrameLoader>
        </div>
    );
}
