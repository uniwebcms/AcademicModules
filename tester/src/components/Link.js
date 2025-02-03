import * as React from 'react';
import { Link, useNavigate as useNav } from 'react-router-dom';

/**
 *
 * @param {*} profile
 * @param {*} options
 * @param {?string} options.mode - view | edit | advanced
 * @returns
 */
const makeProfileHref = (profile, options) => {
    const { tab = '', mode = 'view', searchParams } = options;

    const contentType = profile.getContentType();
    const viewType = profile.getViewType();
    const contentId = profile.getId();

    let finalViewType = viewType || 'profile';

    let targetHref = '';

    if (uniweb.activeUserId() && contentType === 'members' && contentId === uniweb.activeUserId()) {
        targetHref = `/personal/${mode}/${finalViewType}`;

        if (tab) targetHref += `/${tab}`;
    } else {
        let finalType = contentType === 'equipment' ? 'resources' : contentType;

        targetHref =
            mode === 'advanced'
                ? `edit/${finalViewType}/advanced/${finalType}`
                : `/${mode}/${finalViewType}/${finalType}`;

        if (typeof targetHref !== 'string') return '';

        if (contentId) {
            targetHref += `/${contentId}`;

            if (tab) targetHref += `/${tab}`;
        }
    }

    if (searchParams) targetHref += searchParams;

    return targetHref;
};

export default (props) => {
    let {
        external = false,
        children,
        target = '_self',
        title = '',
        style = null,
        className = '',
        to = '',
        profile = null,
        ariaLabel = '',
        options = {},
        website = null,
        rel = 'noopener noreferrer',
    } = props;

    const ac = website || uniweb.activeWebsite;

    let anchorProps = {
        className,
        style,
        rel,
    };

    if (!ariaLabel) {
        if (title) {
            ariaLabel = title;
        } else if (to) {
            ariaLabel = `Navigate to ${to}`;
        } else if (profile) {
            ariaLabel = `Navigate to ${profile.contentType} ${profile.contentId}`;
        }
    }

    anchorProps['aria-label'] = ariaLabel;

    if (title) anchorProps.title = title;

    let href = to;

    href = ac.makeHref(href);

    if (profile) {
        href = makeProfileHref(profile, options);
    }

    // // Link from website to uniweb
    // if (uniweb.getBaseRoute() && href.indexOf('/') === 0 && !external) {
    //     let appDomain = domainInfo.appDomain;
    //     href = `${appDomain}${href}`;
    // }

    // const inFrame = window !== window.top;

    let externalLink = href.includes('//') || href.includes('mailto:');

    if (external || externalLink) {
        anchorProps = {
            ...anchorProps,
            target,
            href,
        };

        // if (inFrame) {
        //     anchorProps.onClick = (e) => {
        //         e.preventDefault();
        //         window.location.replace(href);

        //         return false;
        //     };
        // }

        return <a {...anchorProps}>{children}</a>;
    } else {
        anchorProps = {
            ...anchorProps,
            target,
            to: href,
        };
    }

    const newPageState = {
        // previous: uniweb.activeWebsite.activePage.options.pathname,
        timeStep: uniweb.activeWebsite.timeStep, // save the time step before the jump
    };

    // if (inFrame) {
    //     anchorProps.replace = true;
    // }

    return (
        <Link {...anchorProps} state={newPageState}>
            {children}
        </Link>
    );
};

const useNavigate = () => {
    const navigate = useNav();

    return (to, options = {}) => {
        // const inFrame = window !== window.top;

        // if (inFrame) {
        //     options.replace = true;
        // }

        navigate(to, options);
    };
};

export { makeProfileHref, useNavigate };
