import React from 'react';
import { LuDot } from 'react-icons/lu';

export default function ({ dividerType }) {
    let body = null;

    if (dividerType === 'hr') {
        body = <hr className="my-6 2xl:my-8" />;
    } else {
        body = (
            <div className="my-6 2xl:my-8 flex items-center justify-center space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <LuDot key={i} className="w-4 h-4 text-text-color/40" />
                ))}
            </div>
        );
    }

    return body;
}
