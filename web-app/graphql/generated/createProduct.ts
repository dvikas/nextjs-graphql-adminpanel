/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductImageCreateWithoutProductInput } from "./graphql-global-types";

// ====================================================
// GraphQL mutation operation: createProduct
// ====================================================

export interface createProduct_createProduct_Category {
  __typename: "Category";
  name: string;
  parent: string;
}

export interface createProduct_createProduct_ProductImages {
  __typename: "ProductImage";
  image: string;
}

export interface createProduct_createProduct {
  __typename: "Product";
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  salePrice: number;
  sku: string;
  unit: string;
  Category: createProduct_createProduct_Category;
  ProductImages: createProduct_createProduct_ProductImages[];
}

export interface createProduct {
  createProduct: createProduct_createProduct;
}

export interface createProductVariables {
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
