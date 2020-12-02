import { NextPageContext } from 'next';
import LoginOrSignup from '../components/LoginOrSignup/LoginOrSignup';
import { PageProps } from './_app';

export const handleAuthError = (ctx: NextPageContext): { isAuthenticationError: boolean } | undefined => {
    if (ctx.query.authError === 'true') {
        return { isAuthenticationError: true };
    }
};

interface Props extends PageProps {
    error?: string;
}

function Login(props: Props): JSX.Element {
    return <LoginOrSignup {...props} />;
}

Login.getInitialProps = handleAuthError;

export default Login;
