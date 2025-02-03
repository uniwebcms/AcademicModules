import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ChildBlocks } from './components/PageRenderer';
import Link from './components/Link';
import SafeHtml from './components/SafeHtml';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

uniweb.childBlockRenderer = ChildBlocks;
uniweb.routingComponents = {
    Link,
    SafeHtml,
    useNavigate,
    useParams,
    useLocation,
};

export default function () {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
}
