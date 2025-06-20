export const getMediaLinkType = (link) => {
    const pattern = {
        twitter: 'https://twitter.com',
        facebook: 'https://www.facebook.com',
        linkedin: 'https://www.linkedin.com',
        medium: 'https://medium.com',
        quora: 'https://www.quora.com',
        tumblr: 'https://www.tumblr.com',
        youtube: 'https://www.youtube.com',
        github: 'https://github.com',
        x: 'https://x.com',
        instagram: 'https://www.instagram.com',
    };

    const { route, label, href } = link;

    const url = route || href || '';

    if (url.startsWith('mailto:')) {
        return 'email';
    }
    if (url.startsWith('tel:')) {
        return 'phone';
    }

    if (pattern.hasOwnProperty(label.toLowerCase())) {
        return label.toLowerCase();
    }

    if (Object.values(pattern).some((value) => url.toLowerCase().startsWith(value))) {
        return Object.keys(pattern).find((key) => url.toLowerCase().startsWith(pattern[key]));
    }
};
