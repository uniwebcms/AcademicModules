const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

module.exports = (env) => {
    const remoteUrl = process.env.REMOTE_URL;

    if (!remoteUrl) {
        throw new Error('Remote URL is required. Please provide it in .env');
    }

    return {
        mode: 'development',
        entry: './src/main.js',
        output: {
            publicPath: 'auto',
        },
        devServer: {
            port: 3000,
            hot: true,
            open: true,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react', '@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime'],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.csl$/,
                    type: 'asset/source',
                },
            ],
        },
        plugins: [
            new ModuleFederationPlugin({
                name: 'tester',
                remotes: {
                    WebsiteRemote: `WebsiteRemote@${remoteUrl}${
                        remoteUrl.endsWith('/remoteEntry.js') ? '' : '/remoteEntry.js'
                    }`,
                },
                shared: {
                    react: { singleton: true },
                    'react-dom': { singleton: true },
                },
            }),
            new HtmlWebpackPlugin({
                template: './index.html',
            }),
        ],
        resolve: {
            extensions: ['.js', '.jsx'],
        },
    };
};
