import {
    SiAcademia,
    SiMedium,
    SiMendeley,
    SiOrcid,
    SiLinkedin,
    SiPinterest,
    SiFacebook,
    SiYoutube,
    SiGithub,
    SiX,
    SiInstagram,
    SiTumblr,
    SiQuora,
    SiResearchgate,
} from 'react-icons/si';
import { HiOutlineLink } from 'react-icons/hi2';

export const getMediaLinkType = (link) => {
    const pattern = {
        x: 'https://x.com',
        facebook: 'https://www.facebook.com',
        linkedin: 'https://www.linkedin.com',
        medium: 'https://medium.com',
        quora: 'https://www.quora.com',
        tumblr: 'https://www.tumblr.com',
        youtube: 'https://www.youtube.com',
        github: 'https://github.com',
        instagram: 'https://www.instagram.com',
        tiktok: 'https://www.tiktok.com',
    };

    const { label, href } = link;

    if (pattern.hasOwnProperty(label.toLowerCase())) {
        return label.toLowerCase();
    }

    if (Object.values(pattern).some((value) => href.toLowerCase().startsWith(value))) {
        return Object.keys(pattern).find((key) => href.toLowerCase().startsWith(pattern[key]));
    }
};

export const getMediaLinkLabel = (type) => {
    const map = {
        x: 'X',
        facebook: 'Facebook',
        linkedin: 'LinkedIn',
        medium: 'Medium',
        quora: 'Quora',
        tumblr: 'Tumblr',
        youtube: 'YouTube',
        github: 'GitHub',
        instagram: 'Instagram',
        tiktok: 'TikTok',
    };

    return map[type] || type;
};

export const getMediaIcon = (type) => {
    const map = {
        academia_edu: SiAcademia,
        facebook: SiFacebook,
        linkedin: SiLinkedin,
        medium: SiMedium,
        mendeley: SiMendeley,
        orcid_page: SiOrcid,
        pinterest: SiPinterest,
        quora: SiQuora,
        researchgate: SiResearchgate,
        tumblr: SiTumblr,
        youtube: SiYoutube,
        github: SiGithub,
        instagram: SiInstagram,
        x: SiX,
    };

    let Icon = null;

    if (map[type]) {
        Icon = map[type];
    } else {
        Icon = HiOutlineLink;
    }

    return Icon;
};
