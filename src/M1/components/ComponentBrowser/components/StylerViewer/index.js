import React from 'react';
import Panel from './Panel';
import Bar from './Bar';
import Grid from './Grid';

export default function StylerViewer(props) {
    const { styler, schema, onClose } = props;

    return (
        <div className="w-full h-full flex flex-col lg:flex-row py-6 gap-5 px-5 sm:px-6 md:px-8">
            <div className="hidden lg:block w-[20rem] h-full flex-shrink-0 rounded-md overflow-hidden">
                <Panel styler={styler} onClose={onClose}></Panel>
            </div>
            <div className="block lg:hidden w-full">
                <Bar styler={styler} onClose={onClose}></Bar>
            </div>
            <div className="relative flex-1 h-full overflow-hidden rounded-md bg-neutral-50">
                <Grid schema={schema} styler={styler}></Grid>
            </div>
        </div>
    );
}
