import React, { useMemo } from 'react';
import Container from '../_utils/Container';

// --- JIT-SAFE STATIC MAPS ---
// We must define full strings so Tailwind scanner detects them.

// 1. Vertical Padding (Media Query: Screen based)
// Logic: Mobile -> Tablet (md) -> Desktop (lg)
const PADDING_Y_CLASSES = {
    none: 'py-0',
    xs: 'py-1 md:py-2 lg:py-2', // 0.25rem -> 0.5rem
    sm: 'py-2 md:py-4 lg:py-6', // 0.5rem -> 1.5rem
    md: 'py-4 md:py-8 lg:py-10', // 1rem -> 2.5rem
    lg: 'py-6 md:py-10 lg:py-16', // 1.5rem -> 4rem
    xl: 'py-10 md:py-16 lg:py-24',
    '2xl': 'py-16 md:py-24 lg:py-32',
};

// 2. Horizontal Padding (Media Query: Screen based)
const PADDING_X_CLASSES = {
    none: 'px-0',
    xs: 'px-1 md:px-2 lg:px-2',
    sm: 'px-2 md:px-4 lg:px-6',
    md: 'px-4 md:px-8 lg:px-10',
    lg: 'px-6 md:px-10 lg:px-16',
    xl: 'px-10 md:px-16 lg:px-24',
    '2xl': 'px-16 md:px-24 lg:px-32',
};

// 3. Column Gap (Container Query: Component width based)
// Logic: Uses @md and @lg for container queries
const GAP_X_CLASSES = {
    none: 'gap-x-0',
    xs: 'gap-x-1 @md:gap-x-2 @lg:gap-x-2',
    sm: 'gap-x-2 @md:gap-x-4 @lg:gap-x-6',
    md: 'gap-x-4 @md:gap-x-8 @lg:gap-x-10',
    lg: 'gap-x-6 @md:gap-x-10 @lg:gap-x-16',
    xl: 'gap-x-10 @md:gap-x-16 @lg:gap-x-24',
    '2xl': 'gap-x-16 @md:gap-x-24 @lg:gap-x-32',
};

// 4. Row Gap (Container Query: Component width based)
const GAP_Y_CLASSES = {
    none: 'gap-y-0',
    xs: 'gap-y-1 @md:gap-y-2 @lg:gap-y-2',
    sm: 'gap-y-2 @md:gap-y-4 @lg:gap-y-6',
    md: 'gap-y-4 @md:gap-y-8 @lg:gap-y-10',
    lg: 'gap-y-6 @md:gap-y-10 @lg:gap-y-16',
    xl: 'gap-y-10 @md:gap-y-16 @lg:gap-y-24',
    '2xl': 'gap-y-16 @md:gap-y-24 @lg:gap-y-32',
};

const MAX_WIDTH_MAP = {
    // full: 'w-full',
    // wide: 'max-w-[1400px] mx-auto',
    // regular: 'max-w-7xl mx-auto',
    // narrow: 'max-w-4xl mx-auto',
    // text: 'max-w-prose mx-auto',
    full: 'full',
    wide: 'max-w-[1400px] mx-auto',
    regular: '7xl',
    narrow: '4xl',
    text: 'prose',
};

const ALIGNMENT_MAP = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
    stretch: 'items-stretch',
};

const RATIO_TEMPLATES = {
    '50/50': 'repeat(2, minmax(0, 1fr))',
    '40/60': '2fr 3fr',
    '60/40': '3fr 2fr',
    '30/70': '3fr 7fr',
    '70/30': '7fr 3fr',
    '25/75': '1fr 3fr',
    '75/25': '3fr 1fr',
    '33/33/33': 'repeat(3, minmax(0, 1fr))',
    '25/50/25': '1fr 2fr 1fr',
    '20/60/20': '1fr 3fr 1fr',
    '25/25/25/25': 'repeat(4, minmax(0, 1fr))',
    '15/35/35/15': '1fr 2fr 2fr 1fr', // Narrow Outer (Symmetrical)
    '40/20/20/20': '2fr 1fr 1fr 1fr', // Focus Left
    '20/20/20/40': '1fr 1fr 1fr 2fr', // Focus Right
};

export default function SmartGridRenderer(props) {
    const { block } = props;
    const { childBlocks, properties } = block;

    const {
        columns = 2,
        two_col_layout_configuration,
        three_col_layout_configuration,
        four_col_layout_configuration,
        max_width = 'regular',
        vertical_padding = 'lg',
        horizontal_padding = 'lg',
        column_padding = 'lg',
        row_padding = 'lg',
        vertical_alignment = 'center',
        headerRow = false,
    } = properties || {};

    const colCount = parseInt(columns) || 2;

    // --- Grid Logic ---
    const gridStyle = useMemo(() => {
        let selectedConfig = null;
        if (colCount === 2) selectedConfig = two_col_layout_configuration;
        else if (colCount === 3) selectedConfig = three_col_layout_configuration;
        else if (colCount === 4) selectedConfig = four_col_layout_configuration;

        if (selectedConfig && RATIO_TEMPLATES[selectedConfig]) {
            return RATIO_TEMPLATES[selectedConfig];
        }
        return `repeat(${Math.max(1, colCount)}, minmax(0, 1fr))`;
    }, [
        colCount,
        two_col_layout_configuration,
        three_col_layout_configuration,
        four_col_layout_configuration,
    ]);

    // --- Style Resolution ---
    const maxWidthClass = MAX_WIDTH_MAP[max_width] || MAX_WIDTH_MAP.regular;
    const alignClass = ALIGNMENT_MAP[vertical_alignment] || 'items-center';

    // Look up the FULL strings from the static maps
    // Fallback to 'lg' if the key is missing/invalid
    const paddingYClass = PADDING_Y_CLASSES[vertical_padding] || PADDING_Y_CLASSES['lg'];
    const paddingXClass = PADDING_X_CLASSES[horizontal_padding] || PADDING_X_CLASSES['lg'];
    const gapXClass = GAP_X_CLASSES[column_padding] || GAP_X_CLASSES['lg'];
    const gapYClass = GAP_Y_CLASSES[row_padding] || GAP_Y_CLASSES['lg'];

    // --- Breakpoint Logic ---
    const isMultiCol = colCount > 1;
    let responsiveGridClass = '';

    if (isMultiCol) {
        if (colCount > 2) {
            responsiveGridClass = '@[768px]:grid-cols-[var(--grid-desktop)]';
        } else {
            responsiveGridClass = '@[600px]:grid-cols-[var(--grid-desktop)]';
        }
    }

    const ChildBlocks = block.getChildBlockRenderer();

    return (
        <Container maxWidth={maxWidthClass}>
            <div
                className={`grid grid-cols-1 ${alignClass} ${responsiveGridClass} ${gapXClass} ${gapYClass} ${paddingYClass} ${paddingXClass}`}
                style={{
                    '--grid-desktop': gridStyle,
                }}
            >
                {childBlocks.map((child, index) => {
                    const isHeader = headerRow && index === 0;

                    let spanClass = 'col-span-1';
                    if (isHeader) {
                        if (colCount > 2) spanClass += ' @[768px]:col-span-full';
                        else spanClass += ' @[600px]:col-span-full';
                    }

                    return (
                        <div key={child.id} className={`min-w-0 w-full ${spanClass}`}>
                            <ChildBlocks
                                block={block}
                                childBlocks={[child]}
                                extra={{ as: 'div' }}
                            />
                        </div>
                    );
                })}
            </div>
        </Container>
    );
}
