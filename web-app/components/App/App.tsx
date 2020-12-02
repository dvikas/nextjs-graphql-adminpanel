import Router from 'next/router';
import { NextComponentType, NextPageContext } from 'next';
import { useQuery } from '@apollo/react-hooks';
import { useEffect } from 'react';
import { PageProps } from '../../pages/_app';
import Layout from '../Layout/Layout';
import Loader from '../Loader/Loader';
import { CurrentUserQuery } from '../../graphql/generated/CurrentUserQuery';
import { currentUserQuery } from '../../graphql/queries';
import LoginLayout from '../LoginLayout/LoginLayout';

type Props = {
    component: NextComponentType<any, any, any>;
    query: PageProps['query'];
    pathname: PageProps['pathname'];
    req?: NextPageContext['req'];
};

export type ComponentPageProps = Pick<Props, 'pathname' | 'query'> & {
    user: CurrentUserQuery['me'];
};

const unauthenticatedPathnames = ['/login', '/reset-password', '/signup'];

const App = ({ component: Component, query, pathname, ...props }: Props): JSX.Element | null => {
    const { data: currentUserData, loading: currentUserLoading } = useQuery<CurrentUserQuery>(currentUserQuery);

    const isAnUnauthenticatedPage = pathname !== undefined && unauthenticatedPathnames.includes(pathname);
    // Need to wrap calls of `Router.replace` in a use effect to prevent it being called on the server side
    // https://github.com/zeit/next.js/issues/6713
    useEffect(() => {
        // Redirect the user to the login page if not authenticated
        if (!isAnUnauthenticatedPage && currentUserData?.me === null) {
            Router.replace('/login');
        }
    }, [currentUserData, isAnUnauthenticatedPage, pathname]);

    if (currentUserLoading) {
        return <Loader />;
    }

    if (!isAnUnauthenticatedPage && currentUserData?.me === null) {
        return null;
    }

    if (!currentUserData) {
        return null;
    }

    return pathname !== undefined && unauthenticatedPathnames.includes(pathname) ? (
        <LoginLayout>
            <Component query={query} pathname={pathname} {...props} />
        </LoginLayout>
    ) : (
            <Layout>
                <Component query={query} pathname={pathname} user={currentUserData.me} {...props} />
            </Layout>
        );
};

export default App;
