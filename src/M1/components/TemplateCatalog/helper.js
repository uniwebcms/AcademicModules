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

    // random given preview url (manual made video, youtube or vimeo)
    const manualVideo = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';
    const ytbVideo = 'https://www.youtube.com/watch?v=wDchsz8nmbo&pp=ygUMc2FtcGxlIHZpZGVv';
    const vimeoVideo = 'https://vimeo.com/671676988';

    const videoOptions = [manualVideo, ytbVideo, vimeoVideo];
    const videoType = ['video', 'youtube', 'vimeo']; // 'uniweb'

    const index = Math.floor(Math.random() * videoOptions.length);

    item.preview = {
        src: videoOptions[index],
        type: videoType[index],
    };
};

export const normalizeData = (input, config) => {
    const { profiles } = input;

    return profiles.map((profile) => {
        const { title, subtitle, head } = profile.getBasicInfo();

        const metadata = head.metadata
            ? typeof head.metadata === 'string'
                ? JSON.parse(head.metadata)
                : head.metadata
            : {};

        const { category } = metadata;

        const { url: src, alt } = profile.getImageInfo('banner', 'lg');

        const href = input.makeHref(profile);

        /// get styler type from template
        let templateInfo = head?.template?.[1] || {};

        if (typeof templateInfo === 'string') {
            templateInfo = JSON.parse(templateInfo);
        }

        const stylerId = templateInfo?.styler?.[0];

        const { profile: stylerProfile } = uniweb.useCompleteProfile('webstyler', stylerId);

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

        setItemFilterInfo(item, config);

        return item;
    });
};
