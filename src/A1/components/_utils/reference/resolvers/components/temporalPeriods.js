import React from 'react';
import getFieldValue from '../utils/fieldValueParser';

export default function TemporalPeriodsResolver(props) {
    const { '@': content } = props;

    const [from_year, from_year_period, to_year, to_year_period] = content;

    const fromYear = getFieldValue(from_year, { numberFormat: null });
    const fromYearPeriod = getFieldValue(from_year_period);
    const toYear = getFieldValue(to_year, { numberFormat: null });
    const toYearPeriod = getFieldValue(to_year_period);

    if (fromYear || fromYearPeriod || toYear || toYearPeriod) {
        return (
            <p>
                {fromYear ? <span>{fromYear} </span> : ''}
                {fromYearPeriod ? <span>({fromYearPeriod}) </span> : ''}-{' '}
                {toYear ? <span>{toYear} </span> : ''}
                {toYearPeriod ? <span>({toYearPeriod})</span> : ''}
            </p>
        );
    }

    return null;
}
