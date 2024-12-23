export function formatToCAD(amount) {
    // Check if the input is non-empty and a valid number
    if (amount === null || amount === undefined || amount === '' || isNaN(amount)) {
        return amount || '';
    }

    // Convert to a number in case the input is a string representation of a number
    const numericAmount = Number(amount);

    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(numericAmount);
}
