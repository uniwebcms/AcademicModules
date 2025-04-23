import React from 'react';
import styles from '../Section.module.scss';

export default function ({ dividerType }) {
    let body = null;

    if (dividerType === 'hr') {
        body = <hr className="my-8" />;
    } else {
        body = (
            <div
                className={`block text-center overflow-visible mt-4 mb-4 py-2 w-[896px] mx-auto`}
                contentEditable={false}
            >
                <span
                    className={`text-[30px] inline-block relative italic font-normal ${styles.DotDivider}`}
                >
                    ...
                </span>
            </div>
        );
    }

    return body;
}
