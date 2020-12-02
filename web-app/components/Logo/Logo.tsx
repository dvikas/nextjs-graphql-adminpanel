import React from 'react';
import styled from '@emotion/styled';
import { Text } from '@robertcooper/chakra-ui-core';
import logoPng from '../../assets/icons/logo.png';
import { customTheme } from '../../utils/styles/theme';

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
`;

const LogoImage = styled.img`
    height: 24px;
    margin-right: ${customTheme.space[1]};
`;

const Logo: React.FC = () => {
    return (
        <LogoContainer>
            <LogoImage src={logoPng} alt="Admin Logo" />
            <Text color="gray.700" as="span" fontWeight="medium" fontSize="lg">
                Admin
            </Text>
        </LogoContainer>
    );
};

export default Logo;
