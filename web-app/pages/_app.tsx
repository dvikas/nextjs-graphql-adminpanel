import NextApp, { AppContext } from 'next/app';
import Head from 'next/head';
import { ApolloProvider as ApolloProviderHooks } from '@apollo/react-hooks';
import { WithApolloProps } from 'next-with-apollo';
import { NextPageContext } from 'next';
import { ErrorInfo } from 'react';
import * as Sentry from '@sentry/browser';
import emotionNormalize from 'emotion-normalize';
import { ThemeProvider } from '@material-ui/core/styles';
import { Global, css } from '@emotion/core';
import withApollo from '../utils/withApollo';
import App from '../components/App/App';
import theme from '../theme';
import CssBaseline from '@material-ui/core/CssBaseline';

// For more ideas on how to better configure Sentry with NextJS: https://github.com/zeit/next.js/blob/canary/examples/with-sentry/server.js
Sentry.init({
    dsn: process.env.WEB_APP_SENTRY_DSN,
    // Don't send Sentry events in development environments
    beforeSend: process.env.NODE_ENV === 'development' ? (): null => null : undefined,
});

const globalStyles = css`

    ${emotionNormalize}

    *,
    *::before,
    *::after {
        -webkit-font-smoothing: antialiased; /* Chrome, Safari */
        -moz-osx-font-smoothing: grayscale; /* Firefox */

        box-sizing: border-box;
    }

    html {
        font-size: 16px; /* 1 rem = 16px */
    }

    body {
        font-family: 'Rubik', sans-serif;
    }

    html,
    body,
    #__next {
        height: 100%;
        overflow: auto;
    }

    p {
        line-height: 1.2rem;
    }

    a {
        text-decoration: none;
        transition: all 0.125s ease-in-out;

        &:active {
            color: inherit;
        }
    }

    button {
        background: none;
        padding: 0;
        border: none;
        cursor: pointer;
    }
    .dropzone {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        border-width: 2px;
        border-radius: 2px;
        border-color: #eeeeee;
        border-style: dashed;
        background-color: #fafafa;
        color: #bdbdbd;
        outline: none;
        transition: border .24s ease-in-out;
    }
    .dropzone:focus,.dropzone:active,.dropzone:hover {
        border-color: #3498DB;
        opacity:1
    }
`;

export type PageProps = {
    query?: { resetToken?: string; emailToken?: string };
    pathname?: string;
    req?: NextPageContext['req'];
};

class MyApp extends NextApp<WithApolloProps<{}>> {
    static async getInitialProps({ Component, ctx }: AppContext): Promise<{ pageProps: PageProps }> {
        let pageProps: PageProps = {};

        if (Component.getInitialProps) {
            const componentInitialProps = await Component.getInitialProps(ctx);
            if (componentInitialProps) {
                pageProps = componentInitialProps;
            }
        }

        // Expose the URL query params as props
        pageProps.query = ctx.query;
        pageProps.pathname = ctx.pathname;

        return { pageProps };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        Sentry.withScope((scope) => {
            (Object.keys(errorInfo) as any).forEach((key: keyof typeof errorInfo): void => {
                scope.setExtra(key, errorInfo[key]);
            });

            Sentry.captureException(error);
        });

        super.componentDidCatch(error, errorInfo);
    }

    render(): JSX.Element {
        const { Component, pageProps, apollo } = this.props;

        return (
            <ApolloProviderHooks client={apollo}>
                <ThemeProvider theme={theme}>
                    <Head>
                        <title>Next JS & GraphQL Admin Panel</title>
                        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                    </Head>
                    <Global styles={globalStyles} />
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <App component={Component} {...pageProps} />
                </ThemeProvider>
            </ApolloProviderHooks>
        );
    }
}

export default withApollo(MyApp);
