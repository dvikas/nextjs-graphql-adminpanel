/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QueryCategoriesOrderByInput } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: categories
// ====================================================

export interface categories_categories_nodes {
  __typename: "Category";
  id: string;
  slug: string;
  name: string;
  parent: string;
}

export interface categories_categories {
  __typename: "QueryCategories_Connection";
  /**
   * Flattened list of Category type
   */
  nodes: categories_categories_nodes[];
  totalCount: number;
}

export interface categories {
  categories: categories_categories;
}

export interface categoriesVariables {
  orderBy?: QueryCategoriesOrderByInput | null;
  first?: number | null;
  skip?: number | null;
  parentQuery?: string | null;
}
