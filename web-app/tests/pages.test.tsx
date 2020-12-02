import { useRouter } from 'next/router';
import { render } from '../utils/testUtils';
import { currentUserQuery } from '../graphql/queries';
import Home from '../pages';

jest.mock('next/router');

(useRouter as jest.Mock).mockImplementation(() => ({
    pathname: '/somePathname',
    query: '',
}));

const aCurrentUserQuery = (overrides?: any): any => ({
    request: {
        query: currentUserQuery,
    },
    result: {
        data: {
            me: { id: '123', name: 'Jack' },
        },
    },
    ...overrides,
});

const mocks = [aCurrentUserQuery()];

it('should display the page contents', async () => {
    const { queryByText } = render({ ui: <Home />, mocks });

    expect(queryByText(/admin/)).toBeInTheDocument();
});
