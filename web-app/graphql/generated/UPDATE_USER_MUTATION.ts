/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { User_status, User_role } from "./graphql-global-types";

// ====================================================
// GraphQL mutation operation: UPDATE_USER_MUTATION
// ====================================================

export interface UPDATE_USER_MUTATION_updateUser {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  status: User_status;
  role: User_role;
}

export interface UPDATE_USER_MUTATION {
  updateUser: UPDATE_USER_MUTATION_updateUser;
}

export interface UPDATE_USER_MUTATIONVariables {
  id: string;
  name: string;
  status: string;
  role: string;
}
