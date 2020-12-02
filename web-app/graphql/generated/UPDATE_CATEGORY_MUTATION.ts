/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_CATEGORY_MUTATION
// ====================================================

export interface UPDATE_CATEGORY_MUTATION_updateCategory {
  __typename: "Category";
  id: string;
  name: string;
  slug: string;
  parent: string;
}

export interface UPDATE_CATEGORY_MUTATION {
  updateCategory: UPDATE_CATEGORY_MUTATION_updateCategory;
}

export interface UPDATE_CATEGORY_MUTATIONVariables {
  id: string;
  name?: string | null;
  slug?: string | null;
  parent?: string | null;
}
