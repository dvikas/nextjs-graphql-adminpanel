module.exports = {
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        config.module.rules.push({
            test: /\.(jpe?g|png|gif|ico|webp)$/,
            use: [
                {
                    loader: require.resolve('url-loader'),
                    options: {
                        fallback: require.resolve('file-loader'),
                        outputPath: `${isServer ? '../' : ''}static/images/`,
                        // limit: config.inlineImageLimit,
                        // publicPath: `${config.assetPrefix}/_next/static/images/`,
                        // esModule: config.esModule || false,
                        name: '[name]-[hash].[ext]',
                    },
                },
            ],
        });

        // Fixes npm packages that depend on `fs` module
        // https://github.com/webpack-contrib/css-loader/issues/447
        // https://github.com/zeit/next.js/issues/7755
        if (!isServer) {
            config.node = {
                fs: 'empty',
            };
        }

        return config;
    },
    // This makes the environment variables available at runtime
    // Make sure to set the environment variables in now.json in order to have the environment variables in a deployed environment
    env: {
        COMMON_BACKEND_URL: process.env.COMMON_BACKEND_URL,
        COMMON_FRONTEND_URL: process.env.COMMON_FRONTEND_URL,
        COMMON_STRIPE_YEARLY_PLAN_ID: process.env.COMMON_STRIPE_YEARLY_PLAN_ID,
        COMMON_STRIPE_MONTHLY_PLAN_ID: process.env.COMMON_STRIPE_MONTHLY_PLAN_ID,
        WEB_APP_STRIPE_PUBLISHABLE_KEY: process.env.WEB_APP_STRIPE_PUBLISHABLE_KEY,
        WEB_APP_GOOGLE_API_KEY: process.env.WEB_APP_GOOGLE_API_KEY,
        WEB_APP_MARKETING_SITE: process.env.WEB_APP_MARKETING_SITE,
        WEB_APP_SENTRY_DSN: process.env.WEB_APP_SENTRY_DSN,
        IMAGE_UPLOAD_URL: process.env.IMAGE_UPLOAD_URL,
        IMAGE_UPLOAD_PRESET: process.env.IMAGE_UPLOAD_PRESET,
    },
};
