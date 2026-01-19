import React from 'react';

import { FaGlobe } from 'react-icons/fa';
import {
    FaFacebook,
    FaLinkedin,
    FaMedium,
    FaPinterest,
    FaQuora,
    FaTumblr,
    FaTwitter,
    FaYoutube,
    FaGooglePlusG,
} from 'react-icons/fa';

import { FaOrcid, FaInstagram, FaTiktok } from 'react-icons/fa6';
import { SiAcademia, SiMendeley, SiResearchgate } from 'react-icons/si';

const normalizeType = (t) => (t || '').trim().toLowerCase();

const isLikelyAbsoluteUrl = (s) =>
    /^https?:\/\//i.test(s) ||
    /^mailto:/i.test(s) ||
    /^tel:/i.test(s) ||
    /^ftp:\/\//i.test(s) ||
    /^\/\//.test(s);

const stripLeadingAt = (s) => s.replace(/^@+/, '');
const stripLeadingSlashes = (s) => s.replace(/^\/+/, '');

/**
 * 1) Parse media_link and return the proper media icon (react-icons element)
 * media_link: { website_type: 'YouTube', url: '...' }
 */
export function getMediaIcon(media_link) {
    let type = normalizeType(media_link?.website_type);

    // if not type is provided, try get type from url
    if (!type && media_link?.url) {
        const normalizedUrl = (media_link.url || '').trim().toLowerCase();
        if (normalizedUrl.includes('facebook')) type = 'facebook';
        else if (normalizedUrl.includes('twitter') || normalizedUrl.includes('x.com'))
            type = 'twitter';
        else if (normalizedUrl.includes('instagram')) type = 'instagram';
        else if (normalizedUrl.includes('linkedin')) type = 'linkedin';
        else if (normalizedUrl.includes('youtube')) type = 'youtube';
        else if (normalizedUrl.includes('tiktok')) type = 'tiktok';
        else if (normalizedUrl.includes('medium')) type = 'medium';
        else if (normalizedUrl.includes('pinterest')) type = 'pinterest';
        else if (normalizedUrl.includes('quora')) type = 'quora';
        else if (normalizedUrl.includes('researchgate')) type = 'researchgate';
        else if (normalizedUrl.includes('tumblr')) type = 'tumblr';
        else if (normalizedUrl.includes('orcid.org')) type = 'orcid page';
        else if (normalizedUrl.includes('mendeley.com')) type = 'mendeley';
        else if (normalizedUrl.includes('academia.edu')) type = 'academia.edu';
        else if (normalizedUrl.includes('google.com/+')) type = 'google+';
        else type = 'globe';
    }

    const className = 'w-5 h-5 text-current';

    const iconMap = {
        'academia.edu': SiAcademia,
        facebook: FaFacebook,
        'google+': FaGooglePlusG,
        linkedin: FaLinkedin,
        medium: FaMedium,
        mendeley: SiMendeley,
        'orcid page': FaOrcid,
        pinterest: FaPinterest,
        quora: FaQuora,
        researchgate: SiResearchgate,
        tumblr: FaTumblr,
        twitter: FaTwitter,
        youtube: FaYoutube,
        instagram: FaInstagram,
        tiktok: FaTiktok,
    };

    const Icon = iconMap[type] || FaGlobe;

    return React.createElement(Icon, { className });
}

/**
 * 2) Parse media_link and return the proper href
 * - If url is already absolute (https://...), return as-is
 * - If url is a handle, add the correct prefix
 */
export function getMediaHref(media_link) {
    if (!media_link) return null;

    const type = normalizeType(media_link.website_type);
    let raw = (media_link.url || '').trim();
    if (!raw) return null;

    // already a full URL?
    if (isLikelyAbsoluteUrl(raw)) {
        if (raw.startsWith('//')) return `https:${raw}`;
        return raw;
    }

    // treat as handle/path
    raw = stripLeadingSlashes(raw);

    switch (type) {
        case 'facebook':
            return `https://www.facebook.com/${raw}`;

        case 'twitter': {
            const handle = stripLeadingAt(raw);
            return `https://twitter.com/${handle}`;
        }

        case 'linkedin':
            return `https://www.linkedin.com/${raw}`;

        case 'youtube': {
            if (raw.startsWith('@')) return `https://www.youtube.com/${raw}`;
            if (/^channel\/UC[a-zA-Z0-9_-]+$/.test(raw)) return `https://www.youtube.com/${raw}`;
            if (/^UC[a-zA-Z0-9_-]{10,}$/.test(raw)) return `https://www.youtube.com/channel/${raw}`;
            return `https://www.youtube.com/@${stripLeadingAt(raw)}`;
        }

        case 'medium': {
            const handle = stripLeadingAt(raw);
            return `https://medium.com/@${handle}`;
        }

        case 'pinterest':
            return `https://www.pinterest.com/${raw}`;

        case 'quora':
            if (raw.toLowerCase().startsWith('profile/')) return `https://www.quora.com/${raw}`;
            return `https://www.quora.com/profile/${raw}`;

        case 'researchgate':
            if (raw.toLowerCase().startsWith('profile/'))
                return `https://www.researchgate.net/${raw}`;
            return `https://www.researchgate.net/profile/${raw}`;

        case 'tumblr':
            if (/\.tumblr\.com$/i.test(raw)) return `https://${raw}`;
            return `https://${raw}.tumblr.com`;

        case 'orcid page': {
            const id = raw.replace(/^orcid\.org\//i, '');
            return `https://orcid.org/${id}`;
        }

        case 'mendeley':
            return `https://www.mendeley.com/profiles/${raw}`;

        case 'academia.edu':
            return `https://www.academia.edu/${raw}`;

        case 'google+':
            return `https://plus.google.com/${raw}`;

        default:
            return `https://${raw}`;
    }
}
