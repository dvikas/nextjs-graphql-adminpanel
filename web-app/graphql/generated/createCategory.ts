/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createCategory
// ====================================================

export interface createCategory_createCategory {
  __typename: "Category";
  id: string;
  name: string;
  parent: string;
  slug: string;
}

export interface createCategory {
  createCategory: createCategory_createCategory;
}

export interface createCategoryVariables {
  name: string;
  parent: string;
  slug: string;
}
