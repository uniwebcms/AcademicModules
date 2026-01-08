import { website } from '@uniwebcms/module-sdk';

export function formatEmailSubmissionPlain({ emailRecipient, payload, schema, formTitle }) {
    const prefix = website.localize({ en: 'Request to', fr: 'Demande à' });
    const yesText = website.localize({ en: 'Yes', fr: 'Oui' });
    const noText = website.localize({ en: 'No', fr: 'Non' });
    const uploadedFileText = website.localize({
        en: '[File uploaded]',
        fr: '[Fichier téléchargé]',
    });

    const openingLine1 = website.localize({
        en: 'To Whom It May Concern,',
        fr: 'À qui de droit,',
    });

    const openingLine2 = website.localize({
        en: `Please review the information below, which constitutes the formal submission for: ${formTitle}.`,
        fr: `Veuillez examiner les informations ci-dessous, qui constituent la soumission formelle pour : ${formTitle}.`,
    });

    const footerHeader = website.localize({
        en: 'Submitted via the Online Request Form',
        fr: 'Soumis via le formulaire de demande en ligne',
    });

    const footerName = website.localize({ en: 'Name: [Your Name]', fr: 'Nom : [Votre nom]' });
    const footerEmail = website.localize({
        en: 'Email: [Your Email]',
        fr: 'Email : [Votre email]',
    });
    const footerContact = website.localize({
        en: 'Contact: [Your Contact Information]',
        fr: 'Contact : [Vos informations de contact]',
    });

    const subject = encodeURIComponent(`${prefix} ${formTitle}`);

    const lines = [];

    // Formal opening
    lines.push(openingLine1);
    lines.push('');
    lines.push(openingLine2);
    lines.push('');
    lines.push('');

    // ---- FORM FIELDS ----
    for (const field of schema) {
        const { name, label, widget } = field;
        const rawValue = payload[label] ?? payload[name];
        if (rawValue == null) continue;

        let formattedValue = '';

        switch (widget) {
            case 'checkbox':
                formattedValue = rawValue ? yesText : noText;
                break;

            case 'textarea':
                formattedValue = String(rawValue); // preserve line breaks
                break;

            case 'file':
                if (rawValue instanceof File) {
                    formattedValue = `${uploadedFileText}: ${rawValue.name}`;
                } else if (typeof rawValue === 'string') {
                    formattedValue = `${uploadedFileText}: ${rawValue}`;
                } else {
                    formattedValue = uploadedFileText;
                }
                break;

            case 'input':
            case 'select':
            case 'radio':
            default:
                formattedValue = String(rawValue);
        }

        lines.push(`${label}`);
        lines.push(formattedValue);
        lines.push(''); // spacing
    }

    // ---- FOOTER ----
    lines.push('----------------------------------------\n');
    lines.push(footerHeader);
    lines.push(`${footerName} `);
    lines.push(`${footerEmail} `);
    lines.push(`${footerContact} `);

    const bodyText = lines.join('\r\n');
    const encodedBody = encodeURIComponent(bodyText);

    return `mailto:${emailRecipient}?subject=${subject}&body=${encodedBody}`;
}
