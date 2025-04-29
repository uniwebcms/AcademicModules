import React from 'react';
import { genericFieldRenderer } from './GenericFieldRender';
import clone from 'clone';
import TaskRunner from './TaskRunner';

const FieldValue = ({
    field,
    wrapper,
    editMode = false,
    showLabel = true,

    isSubsectionField = false,
    labelWidth = '40%',
    labelTruncate = true,
}) => {
    if (field?.constraints?.hidden) return null;

    if (
        field.value &&
        (typeof field.value !== 'object' ||
            (typeof field.value === 'object' && Object.keys(field.value).length))
    ) {
        return (
            <div className={`flex items-start`}>
                {showLabel ? (
                    <p
                        className={`font-semibold text-fieldLabelDisplayColor pr-2 flex-shrink-0 ${
                            labelTruncate ? 'truncate' : ''
                        }`}
                        style={{
                            width: isSubsectionField ? `calc(${labelWidth} - 6px)` : labelWidth,
                        }}
                        title={field.label}
                    >
                        {field.label}
                    </p>
                ) : null}
                <div
                    style={{
                        width: showLabel ? `calc(100% - ${labelWidth})` : '100%',
                    }}
                >
                    {genericFieldRenderer(field, false, wrapper, editMode)}
                </div>
            </div>
        );
    }

    return null;
};

export default function (props) {
    const { sectionPath, value } = props;

    const runner = new TaskRunner();

    let localFormat = {};

    try {
        let formatFileName = `members_cv_format.json`;

        localFormat = uniweb.client.loadFormat(`${formatFileName}`);
    } catch (err) {
        try {
            localFormat = require(`./schemas/${formatFileName}`);
        } catch (err) {}
    }

    const getValueRenderer = (value) => {
        if (localFormat[sectionPath]) {
            let fields = {};

            for (const [fieldName, field] of Object.entries(value)) {
                if (fieldName !== 'order' && fieldName !== 'itemId') {
                    if (field.type === 'section') {
                        subsections[fieldName] = field;
                    } else {
                        fields[fieldName] = field;
                    }
                }
            }

            runner.setInput(clone(localFormat[sectionPath]));
            const markup = runner.resolve(fields);

            return (
                <>
                    {markup.map((m, index) => {
                        return <React.Fragment key={index}>{m}</React.Fragment>;
                    })}
                </>
            );
        } else {
            const isSingleFieldSection =
                Object.keys(value).filter(
                    (fieldName) => fieldName !== 'order' && fieldName !== 'itemId'
                ).length === 1;

            return (
                <div className={`space-y-2`}>
                    {Object.keys(value).map((fieldName, fieldIndex) => {
                        const field = value[fieldName];

                        const { type } = field;
                        if (fieldName !== 'order' && fieldName !== 'itemId') {
                            if (type !== 'section') {
                                return (
                                    <FieldValue
                                        key={fieldIndex}
                                        {...{ field, wrapper: 'p', editMode: false }}
                                        showLabel={!isSingleFieldSection}
                                        labelWidth={labelWidth}
                                        labelTruncate={labelTruncate}
                                    />
                                );
                            }
                        } else return null;
                    })}
                </div>
            );
        }
    };

    const cleanedLatest = cleanInvalidSectionItem(value, false);

    const markup = cleanedLatest.map((itemValue, index) => {
        const { itemId, _primaryItem, ...itemFieldsValue } = itemValue;

        return (
            <div key={index}>
                <div className={`flex justify-between group`}>
                    <div>{getValueRenderer(itemFieldsValue, index)}</div>
                </div>
            </div>
        );
    });

    return <div className={`space-y-3 divide-y ${value?.length ? 'mb-1' : ''}`}>{markup}</div>;
}

const cleanInvalidSectionItem = (items) => {
    return items
        .map((item) => {
            const { itemId, _primaryItem, ...fields } = item;

            // clear invalid fields value
            for (const field of Object.values(fields)) {
                if (field.value === '_invalid_') {
                    delete field['value'];
                }
            }

            if (Object.values(fields).some((field) => field.value)) {
                return { itemId, _primaryItem, ...fields };
            }

            return false;
        })
        .filter(Boolean);
};
