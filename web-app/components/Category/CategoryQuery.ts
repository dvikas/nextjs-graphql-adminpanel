import gql from 'graphql-tag';

export const GET_CATEGORIES = gql`
    query categories(
        $orderBy: QueryCategoriesOrderByInput = { updatedAt: desc }
        $first: Int = 10000
        $skip: Int
        $parentQuery: String = ""
    ) {
        categories(first: $first, skip: $skip, orderBy: $orderBy, parentQuery: $parentQuery) {
            nodes {
                id,
                slug,
                name,
                parent
            }
            totalCount
        }
    }
`;