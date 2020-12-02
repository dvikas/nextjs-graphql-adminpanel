import gql from 'graphql-tag';

export const CREATE_CATEGORY = gql`
  mutation createCategory(
    $name: String!
    $parent: String!
    $slug: String!
  ) {
    createCategory(
      name: $name
      parent: $parent
      slug: $slug
    ) {
      id
      name
      parent
      # creation_date
      slug
      # number_of_product
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UPDATE_CATEGORY_MUTATION (
    $id: ID!
    $name: String
    $slug: String
    $parent: String
  ) {
    updateCategory(
      id: $id
      name: $name
      slug: $slug
      parent: $parent
    ) {
      id
      name
      slug
      parent
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DELETE_CATEGORY_MUTATION($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;