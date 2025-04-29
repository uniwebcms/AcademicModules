import * as React from 'react';
import DateRangeResolver from './components/dateRange';
import CurrencyResolver from './components/currency';
import HTMLResolver from './components/html';
import InlineResolver from './components/inline';
import TelephoneResolver from './components/telephone';
import TemporalPeriodsResolver from './components/temporalPeriods';

export default function (action, params, args = {}) {
    const { editMode, taskSuffix, marginBottom } = args;

    switch (action) {
        case 'p':
        case 'h4':
        case 'div':
        case 'span':
        case 'strong':
            const tags = { inline: 'span' };
            const styles = {
                h4: { fontSize: '16.25px', fontWeight: 'bold' },
                strong: { fontWeight: 'bold' },
            };
            let style = styles[action] ?? {};
            if (marginBottom) style['marginBottom'] = marginBottom;

            return (
                <HTMLResolver
                    {...params}
                    editMode={editMode}
                    taskSuffix={taskSuffix}
                    tag={tags[action] ?? action}
                    style={style}
                />
            );
        case 'dateRange':
            return <DateRangeResolver {...params} editMode={editMode} />;
        case 'currency':
            return <CurrencyResolver {...params} editMode={editMode} />;
        case 'inline':
            return <InlineResolver {...params} editMode={editMode} />;
        case 'telephone':
            return <TelephoneResolver {...params} editMode={editMode} />;
        case 'temporalPeriods':
            return <TemporalPeriodsResolver {...params} editMode={editMode} />;

        default:
            // console.error('no resolver found for action: ', action, ' with params: ', params);
            return null;
    }
}
