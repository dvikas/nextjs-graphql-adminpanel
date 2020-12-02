import gql from 'graphql-tag';

export const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION (
    $id: ID!
    $name: String!
    $status: String!
    $role: String!
  ) {
    updateUser(
      id: $id
      name: $name
      status: $status
      role: $role
    ) {
      id
      name
      email
      status
      role
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DELETE_USER_MUTATION($id: ID!) {
    deleteAccount(id: $id) {
      id
    }
  }
`;