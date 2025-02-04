import React, { useState, useEffect } from 'react';
import WebsiteRenderer from './components/WebsiteRenderer';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    // Load remote components to uniweb
    useEffect(() => {
        const loadAllComponents = () => {
            try {
                import('WebsiteRemote/widgets').then((module) => {
                    if (module?.default) {
                        uniweb.setRemoteComponents(module);

                        setIsLoading(false);
                    }
                });
            } catch (error) {
                console.error('Failed to load remote module:', error);
                setIsLoading(false);
            }
        };

        loadAllComponents();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <WebsiteRenderer />;
}

export default App;
