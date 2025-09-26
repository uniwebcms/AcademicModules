import { useGetProfile } from '@uniwebcms/module-sdk';

const setItemFilterInfo = (item, config) => {
    const { filters, sort } = config;

    if (sort) {
        sort.options.forEach((option) => {
            switch (option.value) {
                case 'popularity':
                    item['popularity'] = Math.floor(Math.random() * 1000);
                    break;
                default:
                    break;
            }
        });
    }
};

export const normalizeData = (input, config) => {
    const { profiles } = input;

    return profiles.map((profile) => {
        const { title, subtitle, head } = profile.getBasicInfo();

        const category = profile.options?.tags || [];

        const metadata = head.metadata
            ? typeof head.metadata === 'string'
                ? JSON.parse(head.metadata)
                : head.metadata
            : {};

        const { previewVideo } = metadata;

        const { url: src, alt } = profile.getImageInfo('banner', 'lg');

        const href = input.makeHref(profile);

        /// get styler type from template
        let templateInfo = head?.template?.[1] || {};

        if (typeof templateInfo === 'string') {
            templateInfo = JSON.parse(templateInfo);
        }

        const stylerId = templateInfo?.styler?.[0];

        const { profile: stylerProfile } = useGetProfile('webstyler', stylerId);

        let stylerType = '';

        if (stylerId && stylerProfile) {
            const stylerBasicInfo = stylerProfile.getBasicInfo();

            const stylerHead = stylerBasicInfo?.head
                ? typeof stylerBasicInfo.head === 'string'
                    ? JSON.parse(stylerBasicInfo.head)
                    : stylerBasicInfo.head
                : {};

            const metadata = stylerHead.metadata
                ? typeof stylerHead.metadata === 'string'
                    ? JSON.parse(stylerHead.metadata)
                    : stylerHead.metadata
                : {};

            stylerType = metadata.type || '';
        }

        const item = {
            type: 'profile',
            title,
            description: subtitle,
            image: { src, alt },
            href,
            searchText: `${title} ${subtitle}`,
            category,
            libraryType: stylerType,
            lastEdit: head.last_edit,
        };

        if (previewVideo) {
            const { type, src } = previewVideo;
            item.preview = {
                src,
                type,
            };
        }

        setItemFilterInfo(item, config);

        return item;
    });
};
