import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Math(props) {
    const { content } = props;

    return <BlockMath math={content} />;
}
