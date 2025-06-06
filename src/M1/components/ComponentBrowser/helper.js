import { Profile } from '@uniwebcms/module-sdk';
import axios from 'axios';

const normalizeData = (profiles) => {
    return profiles.map((profile) => {
        const { title, subtitle, head, lastEditStamp } = profile.getBasicInfo();

        const metadata = head.metadata
            ? typeof head.metadata === 'string'
                ? JSON.parse(head.metadata)
                : head.metadata
            : {};

        const { category = [], type = '' } = metadata;

        const { url: src, alt } = profile.getImageInfo('banner', 'lg');

        const item = {
            title,
            description: subtitle,
            image: { src, alt },
            searchText: `${title} ${subtitle}`,
            category: category.filter((item) => item).join(', '),
            type,
            lastEdit: lastEditStamp,
            url: head.url,
            popularity: Math.floor(Math.random() * 1000),
        };

        return item;
    });
};

export const fetchWebstylers = () => {
    const instance = axios.create({
        headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
        },
    });

    return instance
        .get('profiles.php', {
            params: {
                action: 'getProfiles',
                contentType: 'webstyler',
                viewType: 'profile',
                filter: {
                    sql: [['!=', 'visibility', '3']],
                },
                orderBy: [],
                profileLang: '',
            },
        })
        .then((response) => {
            if (response.data?.length) {
                const profiles = response.data.map((item) => {
                    let { contentId, head, ownerId, lastEditTime, handle } = item;
                    if (typeof head === 'string') head = JSON.parse(head) || {};

                    return new Profile('webstyler/profile', contentId, {
                        head: { ...head, ownerId, lastEdit: lastEditTime, handle },
                    });
                });

                return normalizeData(profiles);
            }
        });
};
