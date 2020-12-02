import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import '@testing-library/jest-dom';

const allTheProviders = (mocks?: ReadonlyArray<MockedResponse>): React.FC => {
    const AllTheProviders: React.FC = ({ children }: any) => {
        return (
            <MockedProvider mocks={mocks} addTypename={false}>
                {children}
            </MockedProvider>
        );
    };

    return AllTheProviders;
};
const customRender = ({
    ui,
    options,
    mocks,
}: {
    ui: React.ReactElement;
    options?: Omit<RenderOptions, 'queries'>;
    mocks?: ReadonlyArray<MockedResponse>;
}): RenderResult => render(ui, { wrapper: allTheProviders(mocks), ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
