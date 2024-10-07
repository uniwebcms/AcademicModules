import React from 'react';
import { Asset, FileLogo, stripTags } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

function Layout(props) {
    const { website, profile, data } = props;

    const assetField = 'file',
        titleField = 'display_name',
        descriptionField = 'description';

    const getValueRenderer = (value) => {
        let fileValue = value[assetField] || '';
        let titleValue = value[titleField] || '';
        let descriptionValue = value[descriptionField] || '';

        titleValue = stripTags(website.localize(titleValue));
        descriptionValue = stripTags(website.localize(descriptionValue));

        return (
            <div
                className={`w-full h-full rounded-lg border border-text-color-20 flex flex-col overflow-hidden group shadow-md hover:shadow-lg`}>
                <div className={`h-56`}>
                    <Asset
                        {...{
                            value: fileValue,
                            profile
                        }}
                    />
                </div>
                <div
                    className={`flex-grow flex items-center space-x-1 px-4 py-3 border-t border-text-color-30 bg-heading-color-10`}>
                    <div className='w-8'>{<FileLogo filename={fileValue}></FileLogo>}</div>
                    <div className={`flex flex-col space-y-0.5 max-w-[calc(100%-40px)]`}>
                        <h3 className='text-[16px] font-medium line-clamp-1' title={titleValue}>
                            {titleValue}
                        </h3>
                        {descriptionValue ? (
                            <p className='text-[14px] text-heading-color-60 line-clamp-1' title={descriptionValue}>
                                {descriptionValue}
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    };

    const markup = data.map((item, index) => {
        return <React.Fragment key={index}>{getValueRenderer(item)}</React.Fragment>;
    });

    return markup;
}

export default function ProfileAssets({ input, block, website }) {
    const title = block.mainTitle || '';

    const profile = input?.profile;
    const data = input?.data || [];

    return (
        <Container className='px-6 mx-auto max-w-7xl lg:px-8'>
            <h2 className='text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-8 md:mb-12'>
                {stripTags(title)}
            </h2>
            <div>
                <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-20'>
                    <Layout
                        {...{
                            profile,
                            data,
                            website
                        }}
                    />
                </div>
            </div>
        </Container>
    );
}
