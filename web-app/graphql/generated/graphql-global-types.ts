/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum OrderByArg {
  asc = "asc",
  desc = "desc",
}

export enum User_role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
}

export enum User_status {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  INACTIVE = "INACTIVE",
}

export interface ProductImageCreateWithoutProductInput {
  createdAt?: any | null;
  id?: string | null;
  image: string;
  updatedAt?: any | null;
}

export interface ProductOrderByInput {
  name?: OrderByArg | null;
  price?: OrderByArg | null;
  updatedAt?: OrderByArg | null;
}

export interface QueryCategoriesOrderByInput {
  name?: OrderByArg | null;
  updatedAt?: OrderByArg | null;
}

export interface QueryUsersOrderByInput {
  name?: OrderByArg | null;
  status?: OrderByArg | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
