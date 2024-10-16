export const convertToProfileData = (sections) => {
    let counter = 0;

    Object.entries(sections).forEach(([sectionName, section]) => {
        // Ensure defaults for missing properties using the nullish assignment operator
        section.section_id = ++counter;
        section.has_fields = 1;
        section.name ??= sectionName;
        section.label ??= sectionName;
        section.subsections ??= {};
        section.fields ??= {};
        section.items ??= [];

        // Enhance fields with name and label
        Object.entries(section.fields).forEach(([key, field]) => {
            field.name ??= key;
            field.label ??= key;
            field.field_id = key; // We could use numbers, but this seems easier
        });

        const items = section.items.map((item, index) => {
            const id = `${sectionName}_${index}`;
            const attributes = item._attributes_ || {};
            delete item._attributes_; // Remove _attributes_ from the original item
            return { id, values: item, attributes };
        });

        section.items = items;
    });

    return Object.values(sections);
};
