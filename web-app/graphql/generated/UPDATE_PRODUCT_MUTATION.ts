/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductImageCreateWithoutProductInput } from "./graphql-global-types";

// ====================================================
// GraphQL mutation operation: UPDATE_PRODUCT_MUTATION
// ====================================================

export interface UPDATE_PRODUCT_MUTATION_updateProduct_Category {
  __typename: "Category";
  name: string;
  parent: string;
}

export interface UPDATE_PRODUCT_MUTATION_updateProduct_ProductImages {
  __typename: "ProductImage";
  image: string;
}

export interface UPDATE_PRODUCT_MUTATION_updateProduct {
  __typename: "Product";
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  salePrice: number;
  sku: string;
  unit: string;
  Category: UPDATE_PRODUCT_MUTATION_updateProduct_Category;
  ProductImages: UPDATE_PRODUCT_MUTATION_updateProduct_ProductImages[];
}

export interface UPDATE_PRODUCT_MUTATION {
  updateProduct: UPDATE_PRODUCT_MUTATION_updateProduct;
}

export interface UPDATE_PRODUCT_MUTATIONVariables {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  salePrice: number;
  sku: string;
  unit: string;
  categoryId: string;
  images: ProductImageCreateWithoutProductInput[];
}
