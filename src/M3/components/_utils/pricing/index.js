import { website } from '@uniwebcms/module-sdk';

export function formatToCAD(amount) {
    // Check if the input is non-empty and a valid number
    if (amount === null || amount === undefined || amount === '' || isNaN(amount)) {
        return amount || '';
    }

    // Convert to a number in case the input is a string representation of a number
    const numericAmount = Number(amount);

    const currentLanguage = website.getLanguage();

    const locals = {
        en: 'en-CA',
        fr: 'fr-CA',
    };

    return new Intl.NumberFormat(locals[currentLanguage], {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
    }).format(numericAmount);
}
