import React from 'react';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Logo from '../Logo/Logo';

type Props = {};

const LoginLayout: React.FC<Props> = ({ children }) => {
    return (
        <Box>
            { children}
        </Box>
    );
};

export default LoginLayout;
