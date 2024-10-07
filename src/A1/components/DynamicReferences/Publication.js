import React from 'react';
import { SafeHtml } from '@uniwebcms/module-sdk';
import Cite from '../_utils/cite/Render';

const isInitial = (name) => {
    return name.length <= 4 && name === name.toUpperCase() && name != name.toLowerCase();
};

const cleanupAuthorsStr = (authors) => {
    //Covert " and ", ",and ", ", and" to comma
    //Covert the same format for "&" as well
    //Examples:
    //1. (*) Gao, X, (*) Porter, J, Brooks, S, and Arnold, D V
    //2. Welsh, T.N., Pacione, S.*, & Neyedli, H.F
    //3. 'M. A. MacLean,* C. A. Wheaton,* and Mark Stradiotto*'
    let regex = /\,?\s*\*?((\sand\s)|\&)\s*/g;
    let str = authors.replaceAll(regex, ',');

    //Remove et al.
    const hasOtherAuthors = str.includes('et al');

    regex = /\,?\s*et\sal\.?\s*/g;
    str = str.replaceAll(regex, '');

    //Remove empty comma
    //Example: 'F. Riahi(*),, Z. Zolaktaf(*), M. Shafiei, E. Milios'
    regex = /\,\s*\,/g;
    str = str.replaceAll(regex, ',');

    //replace *, (*) to single *
    regex = /(\s*\*)|(\(\s*\*\s*\))/g;
    str = str.replaceAll(regex, '*');

    //Remove parentheses
    regex = /\(.*\)/g;
    str = str.replaceAll(regex, '');

    //Remove brackets
    regex = /\[.*\]/g;
    str = str.replaceAll(regex, '');

    //Replace \n to ' '
    str = str.replaceAll(/\n/g, ' ');

    str = str.trim();

    // Replace all multiples spaces by a single space
    str = str.replaceAll(/ +/g, ' ');

    // Remove all space after ;
    str = str.replaceAll(/; /g, ';');

    // Replace all multiples spaces by a single space
    str = str.replaceAll(/;+/g, ';');

    // Clean str if it is a single ';'
    if (str === ';') str = '';

    // remove last ';'
    // if (str.charAt(str.length - 1) === ';') str = str.slice(0, -1);

    // console.log(`str${str}`);

    //Remove the last comma if it is the last letter
    if (str.charAt(str.length - 1) === ',') {
        str = str.substr(0, str.length - 1);
    }

    return { cleanStr: str, hasOtherAuthors: hasOtherAuthors };
};

const initSMMode = (authors) => {
    const p = authors.split(';');
    const weights = {
        perfects: 0,
        nonPerfects: 0,
    };

    p.forEach((item) => {
        let itemArray = item.split(',');

        if (itemArray.length === 2) {
            weights.perfects++;
        } else {
            weights.nonPerfects++;
        }
    });

    const accuracy = weights.nonPerfects === 0 ? 'perfect' : 'PARTIAL';

    // this.setFormatType('SM', accuracy, authors);
    return {
        parsedAuthors: authors,
        parsedType: 'SM',
        parsedAccuracy: accuracy,
    };
};

const initOtherMode = (authors) => {
    //Separate authors by comma
    const splitsByComma = authors.split(',');

    //Used for tell between single comma mode and double comma mode
    const weights = { single: 0, double: 0 };

    // Used for tell between first name first and last name first in single comma mode
    const flWeights = { ff: 0, lf: 0 };

    let preCount = 0;

    for (let i = 0; i < splitsByComma.length; i++) {
        let item = splitsByComma[i];
        if (item === '') continue;
        let words = item.trim().split(' ');
        //Count the number of words
        let count = words.length;
        preCount = i ? splitsByComma[i - 1].trim().split(' ').length : 0;
        //Double comma mode, every single name is separated by a comma
        if (count === 1) {
            weights.double++;
        } else {
            if (isInitial(item)) {
                weights.double++;
            } else {
                //The name in even postion contains multiple words, and the previous part only contain one word
                //We treat it as DC mode. The second part of the name might contains middle name.
                if (preCount == 1) {
                    weights.double++;
                } else {
                    weights.single++;

                    //Check if the first word is first name
                    if (isInitial(words[0])) {
                        flWeights.ff++;
                    } else if (isInitial(words[words.length - 1])) {
                        flWeights.lf++;
                    } else {
                        //Both first word and last word are not initials
                        //We treat the name as First name first mode.
                        flWeights.ff++;
                    }
                }
            }
        }
    }

    //Mixed mode
    if (weights.double && weights.single) {
        //if single mode has higher weight, we cannot display the name correctly
        if (weights.single >= weights.double) {
            // console.log('Mixed mode, cannot tell single or double comma mode.');
            // return this.setFormatType('', 'unknown');
            return {
                parsedType: '',
                parsedAccuracy: 'unknown',
                parsedAuthors: '',
            };
        } else {
            //Number of splits must be even. Each name must contain exact two parts
            if (splitsByComma.length % 2 == 1) {
                // console.log('DC mode with odd number of words.');
                // return this.setFormatType('', 'unknown');
                return {
                    parsedType: '',
                    parsedAccuracy: 'unknown',
                    parsedAuthors: '',
                };
            }

            //It may still fine if the DC mode has higher weight
            // return this.setFormatType('DC', 'PARTIAL', authors);
            return {
                parsedType: 'DC',
                parsedAccuracy: 'PARTIAL',
                parsedAuthors: authors,
            };
        }
    }

    if (weights.double) {
        //Number of splits must be even. Each name must contain exact two parts
        if (splitsByComma.length % 2 == 1) {
            // console.log('DC mode with odd number of words.');
            // return this.setFormatType('', 'unknown');
            return {
                parsedType: '',
                parsedAccuracy: 'unknown',
                parsedAuthors: '',
            };
        }

        // return this.setFormatType('DC', 'perfect', authors);
        return {
            parsedType: 'DC',
            parsedAccuracy: 'perfect',
            parsedAuthors: authors,
        };
    }

    if (weights.single) {
        if (flWeights.ff >= flWeights.lf) {
            let accuracy = flWeights.lf == 0 ? 'perfect' : 'PARTIAL';
            // return this.setFormatType('SCFF', accuracy, authors);
            return {
                parsedType: 'SCFF',
                parsedAccuracy: accuracy,
                parsedAuthors: authors,
            };
        } else {
            let accuracy = flWeights.ff == 0 ? 'perfect' : 'PARTIAL';
            // return this.setFormatType('SCLF', accuracy, authors);
            return {
                parsedType: 'SCLF',
                parsedAccuracy: accuracy,
                parsedAuthors: authors,
            };
        }
    }
};

const parseAuthors = (authors) => {
    if (!authors) {
        return {
            parsedAuthors: '',
            parsedType: 'SM',
            parsedAccuracy: '',
            hasOtherAuthors: false,
        };
    } else {
        const splitsBySemicolon = authors.split(';');
        const { cleanStr: authorsStrClean, hasOtherAuthors } = cleanupAuthorsStr(authors);

        if (splitsBySemicolon.length > 1) {
            return {
                ...initSMMode(authorsStrClean),
                hasOtherAuthors: hasOtherAuthors,
            };
        } else {
            return {
                ...initOtherMode(authorsStrClean),
                hasOtherAuthors: hasOtherAuthors,
            };
        }
    }
};

const init = (initialValue) => {
    const { parsedAuthors, parsedType, parsedAccuracy, hasOtherAuthors } =
        parseAuthors(initialValue);
    let parsedAuthorArray = [];
    let rawMode = false;
    switch (parsedType) {
        case 'SCLF':
        case 'SCFF': {
            let p = parsedAuthors.split(',');
            parsedAuthorArray = p.map((item) => {
                let isStudent = item.includes('*');
                let name = item.replaceAll(/\**/g, '');
                let p2 = name.trim().split(' ');
                let lastName = parsedType === 'SCLF' ? p2.shift().trim() : p2.pop().trim();
                let firstName = p2.join(' ').trim();
                name = lastName + ', ' + firstName;
                return [name, isStudent];
            });
            break;
        }
        case 'DC': {
            if (parsedAccuracy === 'perfect' || parsedAccuracy === 'PARTIAL') {
                let p = parsedAuthors.split(',');
                const parsedArray = p.reduce(
                    (rows, item, index) =>
                        (index % 2 == 0
                            ? rows.push([item.trim()])
                            : rows[rows.length - 1].push(item.trim())) && rows,
                    []
                );
                parsedAuthorArray = parsedArray.map((item) => {
                    let name = item.join(', ');
                    let isStudent = name.includes('*');
                    name = name.trim().replaceAll(/\**/g, '');
                    return [name, isStudent];
                });
            }
            break;
        }
        case 'SM': {
            let p = parsedAuthors.split(';');
            parsedAuthorArray = p.map((item) => {
                let isStudent = item.includes('*');
                let name = item.replaceAll(/\**/g, '');
                return [name, isStudent];
            });
            break;
        }
        default: {
            rawMode = true;
            break;
        }
    }

    return {
        initialAuthors: initialValue,
        parsedAuthors: parsedAuthors,
        parsedType: parsedType,
        parsedAccuracy: parsedAccuracy,
        hasOtherAuthors: hasOtherAuthors,
        parsedAuthorArray: rawMode
            ? []
            : parsedAuthorArray.length > 0
            ? parsedAuthorArray
            : [['', false]],
        rawMode: rawMode,
    };
};

export default function Publication(props) {
    const { publication } = props;

    // const { Cite } = website.getRoutingComponents();
    const head = publication.rawHead;

    const { data, title, doi, date, meta_data } = head;

    let parsedData = data;
    //For some reason, maybe beacuse the raw editor is not working properly, the data is being saved as a string
    if (typeof parsedData === 'string') {
        parsedData = JSON.parse(parsedData);
    }

    let parsedMeta = meta_data;
    if (typeof parsedMeta === 'string') {
        parsedMeta = JSON.parse(parsedMeta);
    }

    parsedData = {
        ...parsedData,
        title,
        date,
    };

    let finalDoi = doi || parsedData?.doi || '';

    finalDoi =
        finalDoi && finalDoi.startsWith('https://doi.org/')
            ? finalDoi.replace('https://doi.org/', '')
            : finalDoi;

    let completeDoi = finalDoi ? `https://doi.org/${finalDoi}` : '';

    let {
        authors,
        date: d,
        pages,
        publisher,
        published,
        volume,
        issue,
        page_range,
        journal,
        url,
    } = parsedData;

    let finalData = { title, DOI: finalDoi, type: 'article-journal', volume, issue, journal };

    if (authors) {
        const { parsedAuthorArray } = init(authors);

        authors = parsedAuthorArray.map((author) => {
            const [name, asterisk] = author;

            let [family, given] = name.split(',');

            if (!given) {
                let p = family.split(' ');

                family = p?.[0];
                given = p?.[1] || '';
            }

            return { given: given.trim(), family: `${asterisk ? '*' : ''}${family.trim()}` };
        });

        finalData.author = authors;
    }

    if (published) {
        finalData['publisher-place'] = published;
    }

    if (pages || page_range) {
        finalData.page = pages || page_range;
    }

    if (publisher) {
        finalData.publisher = publisher;
    }

    if (d) {
        const [year, month] = d.split('/');
        finalData.issued = {
            'date-parts': [[parseInt(year), parseInt(month)]],
        };
    }

    if (parsedData['periodical-title'] || journal) {
        finalData['container-title'] = parsedData['periodical-title'] || journal;
    }

    const lang = uniweb.language();

    // const markup = <CiteRender data={[parsedData]} style={'apa'} locale={lang}></CiteRender>;
    const cite = new Cite([finalData]);

    // The first argument is the Plugin name (CSL Bibliography)
    let output = cite.format('bibliography', {
        format: 'html', // output format. See comments above.
        template: 'apa', // 'vancouver' | 'apa' | 'harvard | 'chicago', 'mla'
        lang,
        // 'author-limit': 1, // Show only the first author before using "et al."
        // 'et-al-min': 3, // Use "et al." if there are 4 or more authors
        // 'et-al-use-first': 1,
    });

    return (
        <div className={`flex justify-between px-3.5 group overflow-hidden py-3`}>
            <div className={`flex flex-col w-full`}>
                <SafeHtml value={output}></SafeHtml>
            </div>
        </div>
    );
}
