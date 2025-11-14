import React from 'react';
import { Link } from '@uniwebcms/core-components';

export default function JoinExpertList(props) {
    const { website } = props;

    return (
        <section className="container mt-16">
            <div className="text-center border-t border-text-color/20 pt-8">
                <p className="text-base text-[var(--color-text-secondary)] font-body">
                    {website.localize({
                        en: 'Are you a faculty member? ',
                        fr: 'Êtes-vous un membre du corps professoral? ',
                    })}
                    <Link to="join" className="font-medium hover:underline">
                        {website.localize({
                            en: 'Request to be added to the expert list',
                            fr: 'Demandez à être ajouté à la liste des experts',
                        })}
                    </Link>
                </p>
            </div>
        </section>
    );
}
