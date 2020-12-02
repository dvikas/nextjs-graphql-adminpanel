import withApollo from 'next-with-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { resolvers, typeDefs } from './resolvers';

export default withApollo(({ initialState, headers }) => {
    const request = (operation: any): void => {
        operation.setContext({
            fetchOptions: {
                credentials: 'include',
            },
            // https://github.com/apollographql/apollo-client/issues/4193#issuecomment-448682173
            headers: {
                cookie: headers && headers.cookie, // NOTE: client-side headers is undefined!
            },
        });
    };

    const requestLink = new ApolloLink(
        (operation, forward) =>
            new Observable((observer) => {
                let handle: any;
                Promise.resolve(operation)
                    .then((oper) => request(oper))
                    .then(() => {
                        handle = forward(operation).subscribe({
                            next: observer.next.bind(observer),
                            error: observer.error.bind(observer),
                            complete: observer.complete.bind(observer),
                        });
                    })
                    .catch(observer.error.bind(observer));

                return (): void => {
                    if (handle) {
                        handle.unsubscribe();
                    }
                };
            })
    );

    const cache = new InMemoryCache({ addTypename: false }).restore(initialState || {});
    cache.writeData({
        data: {
            isLeftDrawerOpen: false,
            leftDrawerWidth: 260,
            cartItems: [],
            snackMsg: 'default',
            snackType: 'success',
            snackBarOpen: false
        },
    });


    return new ApolloClient({
        link: ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors) {
                    graphQLErrors.forEach(({ message, locations, path }) =>
                        // eslint-disable-next-line no-console
                        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
                    );
                }
                if (networkError) {
                    // eslint-disable-next-line no-console
                    console.log(`[Network error]: ${networkError}`);
                }
            }),
            requestLink,
            createUploadLink({
                uri: process.env.COMMON_BACKEND_URL,
            }),
        ]),
        cache,
        resolvers,
        typeDefs,
    });
});
