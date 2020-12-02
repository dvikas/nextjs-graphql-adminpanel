import { NextPageContext } from 'next';
import LoginOrSignup from '../components/LoginOrSignup/LoginOrSignup';
import { PageProps } from './_app';

export const handleAuthError = (ctx: NextPageContext): { error: string } | undefined => {
    if (ctx.query.authError === 'true') {
        return { error: `There's been a problem with your authentication.` };
    }
};

interface Props extends PageProps {
    error?: string;
}

function Signup(props: Props): JSX.Element {
    return <LoginOrSignup isLogin={false} {...props} />;
}

Signup.getInitialProps = handleAuthError;

export default Signup;
