import React from 'react';
import Box from '@material-ui/core/Box';


type Props = {};

const LoginLayout: React.FC<Props> = ({ children }) => {
    return (
        <Box>
            { children}
        </Box>
    );
};

export default LoginLayout;
