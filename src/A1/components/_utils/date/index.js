import { website } from '@uniwebcms/module-sdk';

export const getDateRange = (startDate, endDate) => {
    return [startDate, endDate]
        .map((item) => {
            if (!item) return null;
            const date = new Date(item);

            return date.toLocaleDateString(website.getLanguage(), {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        })
        .filter(Boolean)
        .join(' - ');
};
