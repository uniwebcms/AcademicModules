import React, { useState, useRef, useEffect } from 'react';
import { TbChevronCompactDown } from 'react-icons/tb';

const TextTruncator = (props) => {
    const {
        text,
        maxLine = 'line-clamp-1',
        className = '',
        style = {},
        tag: Tag = 'div',
        controlClassName = '',
        initialTruncate = true,
    } = props;

    const [truncated, setTruncated] = useState(true);
    const [truncatable, setTruncatable] = useState(false);

    let textRef = useRef(null);

    useEffect(() => {
        setTruncated(initialTruncate);
    }, [initialTruncate]);

    useEffect(() => {
        const element = textRef?.current;

        if (element) {
            if (
                (element.offsetHeight < element.scrollHeight ||
                    element.offsetWidth < element.scrollWidth) &&
                initialTruncate
            ) {
                setTruncatable(true);
            }
        }
    }, [text, textRef?.current, initialTruncate]);

    const isTruncated = truncatable && truncated;

    if (text && text !== 'null') {
        return (
            <Tag className={`${className}`} style={style}>
                <span
                    ref={textRef}
                    className={`${truncated ? maxLine : ''}`}
                    dangerouslySetInnerHTML={{ __html: text }}
                ></span>
                {truncatable ? (
                    <button
                        className={`px-1.5 py-px -ml-1.5 flex items-center space-x-1 bg-transparent hover:bg-gray-200 rounded-md focus:outline-none text-gray-600 hover:text-gray-700 mt-1.5 text-[14px] font-semibold ${controlClassName}`}
                        onClick={() => {
                            setTruncated(!truncated);
                        }}
                    >
                        <p>
                            {isTruncated
                                ? localize({
                                      en: 'Show more',
                                      fr: 'Afficher plus',
                                  })
                                : localize({
                                      en: 'Show less',
                                      fr: 'Afficher moins',
                                  })}
                        </p>
                        {isTruncated ? (
                            <TbChevronCompactDown className={`w-5 h-5`} />
                        ) : (
                            <TbChevronCompactDown
                                className={`w-5 h-5 transform rotate-180 duration-300`}
                            />
                        )}
                    </button>
                ) : null}
            </Tag>
        );
    } else {
        return null;
    }
};

export default TextTruncator;
