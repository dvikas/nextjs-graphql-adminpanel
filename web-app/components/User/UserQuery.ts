import gql from 'graphql-tag';

export const USER_PERMISSIONS = gql`

    query users(
        $orderBy: QueryUsersOrderByInput = { name: desc }
        $first: Int = 10000
        $skip: Int
    ) {
        users(first: $first, skip: $skip, orderBy: $orderBy) {
            nodes {
                id,
                name,
                email,
                status,
                role
            }
            totalCount
        }
    }

`;