import { website } from '@uniwebcms/module-sdk';

// export function formatEmailSubmissionHTML({ emailRecipient, payload, schema, formTitle }) {
//     // Localized fixed text
//     const prefix = website.website.localize({ en: 'Request to', fr: '' });
//     const yesText = website.website.localize({ en: 'Yes', fr: '' });
//     const noText = website.website.localize({ en: 'No', fr: '' });
//     const uploadedFileText = website.website.localize({ en: 'File uploaded', fr: '' });

//     const subject = encodeURIComponent(`${prefix} ${formTitle}`);

//     // Build HTML rows
//     const rows = [];

//     for (const field of schema) {
//         const { name, label, widget } = field;

//         const rawValue = payload[label] ?? payload[name];

//         // undefined/null → skip
//         if (rawValue == null) continue;

//         let formattedValue = '';

//         switch (widget) {
//             case 'checkbox':
//                 formattedValue = rawValue ? yesText : noText;
//                 break;

//             case 'textarea':
//                 // convert line breaks to <br/>
//                 formattedValue = String(rawValue).replace(/\n/g, '<br />');
//                 break;

//             case 'file':
//                 if (rawValue instanceof File) {
//                     formattedValue = `${uploadedFileText}: ${rawValue.name}`;
//                 } else if (typeof rawValue === 'string') {
//                     formattedValue = `<a href="${rawValue}" target="_blank">${rawValue}</a>`;
//                 } else {
//                     formattedValue = uploadedFileText;
//                 }
//                 break;

//             case 'input':
//             case 'select':
//             case 'radio':
//             default:
//                 formattedValue = String(rawValue);
//         }

//         rows.push(`
//       <tr style="vertical-align: top;">
//         <td style="padding: 6px 12px; font-weight: bold; width: 200px;">
//           ${label}
//         </td>
//         <td style="padding: 6px 12px;">
//           ${formattedValue}
//         </td>
//       </tr>
//     `);
//     }

//     const htmlBody = `
//     <div style="font-family: Arial, sans-serif; font-size: 14px;">
//       <h2>${prefix} ${formTitle}</h2>
//       <table border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%;">
//         ${rows.join('\n')}
//       </table>
//     </div>
//   `;

//     const encodedBody = encodeURIComponent(htmlBody);

//     return `mailto:${emailRecipient}?subject=${subject}&body=${encodedBody}`;
// }

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
