/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductOrderByInput } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: products
// ====================================================

export interface products_products_nodes_Category {
  __typename: "Category";
  id: string;
  name: string;
  parent: string;
}

export interface products_products_nodes_ProductImages {
  __typename: "ProductImage";
  image: string;
}

export interface products_products_nodes {
  __typename: "Product";
  id: string;
  name: string;
  price: number;
  discount: number;
  salePrice: number;
  sku: string;
  unit: string;
  description: string;
  Category: products_products_nodes_Category;
  ProductImages: products_products_nodes_ProductImages[];
}

export interface products_products {
  __typename: "QueryProducts_Connection";
  /**
   * Flattened list of Product type
   */
  nodes: products_products_nodes[];
  totalCount: number;
}

export interface products {
  products: products_products;
}

export interface productsVariables {
  orderBy?: ProductOrderByInput | null;
  first?: number | null;
  skip?: number | null;
  nameQuery?: string | null;
  discount?: string | null;
}
