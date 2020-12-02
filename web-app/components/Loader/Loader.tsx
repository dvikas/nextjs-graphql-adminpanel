import React from 'react';
import styled from '@emotion/styled';

type LoaderProps = {};

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const Plane = styled.div`
    perspective: 120px;
    width: 40px;
    height: 40px;
    background-image: linear-gradient(to bottom right, #2e5bff, #d63649);
    animation: flip 1s infinite;

    @keyframes flip {
        50% {
            transform: rotateY(180deg);
        }
        100% {
            transform: rotateY(180deg) rotateX(180deg);
        }
    }
`;

const Loader: React.FC<LoaderProps> = () => {
    return (
        <Container>
            <Plane />
        </Container>
    );
};

export default Loader;
