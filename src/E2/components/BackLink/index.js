import React from 'react';
import { Link } from '@uniwebcms/core-components';
import { LuArrowLeft } from 'react-icons/lu';

export default function BackLink(props) {
    const { website } = props;

    const { useLocation } = website.getRoutingComponents();
    const location = useLocation();

    const params = new URLSearchParams(location.search);

    const id = params.get('id');
    const search = params.get('search');
    const topic = params.get('topic');
    const faculty = params.get('faculty');

    const noSearchParam = !search && !topic && !faculty;

    let to, label;

    if (location.pathname.endsWith('/join') || location.pathname.endsWith('/search')) {
        to = '/';
        label = website.localize({ en: 'Back to Search', fr: 'Retour à la recherche' });
    }

    if (location.pathname.endsWith('/expert')) {
        if (noSearchParam) {
            to = '/';
            label = website.localize({ en: 'Back to Search', fr: 'Retour à la recherche' });
        } else {
            to = `search${location.search}`;
            label = website.localize({ en: 'Back to Results', fr: 'Retour aux résultats' });
        }
    }

    if (location.pathname.endsWith('/expert/request') && id) {
        to = `expert${location.search}`;
        label = website.localize({ en: 'Back to Profile', fr: 'Retour au profil' });
    }

    return (
        <Link
            className="inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold transition-color focus:outline-none border-2 border-transparent bg-transparent mb-6 hover:border-link-hover-color rounded-[var(--border-radius)] cursor-pointer"
            to={to}
        >
            <LuArrowLeft className="w-4 h-4 text-inherit" aria-hidden="true" />
            {label}
        </Link>
    );
}
