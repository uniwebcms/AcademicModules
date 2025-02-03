import React, { useState, useEffect } from 'react';

function BlockRenderer({ block }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadBlockComponent = async () => {
            await block.loadComponent();
            setIsLoaded(true);
        };

        loadBlockComponent();
    }, [block]);

    if (!isLoaded) {
        return <div>Loading component...</div>;
    }

    if (!block.Component) {
        return <div>Failed to load component</div>;
    }

    return <block.Component {...block.props} />;
}

export default BlockRenderer;
