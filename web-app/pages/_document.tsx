import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import * as Sentry from '@sentry/browser';
import { ServerStyleSheets } from '@material-ui/core/styles';
import theme from '../theme';

process.on('unhandledRejection', (err) => {
    Sentry.captureException(err);
});

process.on('uncaughtException', (err) => {
    Sentry.captureException(err);
});

export default class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html lang="en">
                <Head>
                    {/* PWA primary color */}
                    <meta name="theme-color" content={theme.palette.primary.main} />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />

                    <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png" />

                    <link rel="icon" type="image/png" sizes="192x192" href="/static/android-chrome-192x192.png" />
                    <link rel="icon" type="image/png" sizes="512x512" href="/static/android-chrome-512x512.png" />
                    <link rel="icon" type="image/png" sizes="48x48" href="/static/favicon.ico" />
                    <link rel="manifest" href="/static/manifest.json" />
                    <meta name="msapplication-TileColor" content="#ffffff" />
                    <meta name="msapplication-TileImage" content="/static/ms-icon-144x144.png" />
                    <meta name="theme-color" content="#ffffff" />
                </Head>
                <body>
                    <Main />
                    {/* <div id="modal" /> */}
                    <NextScript />
                </body>
            </Html>
        );
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};
