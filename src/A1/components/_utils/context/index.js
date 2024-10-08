import context from '../../../context.json';

export const getNextBlockContext = (block) => {
    const nextBlockInfo = block.getNextBlockInfo();

    if (nextBlockInfo) {
        const { category, theme, state } = nextBlockInfo;

        return {
            theme,
            ...state,
            ...context[category],
        };
    }

    if (context[category]) {
        return context[category];
    }

    return {};
};
