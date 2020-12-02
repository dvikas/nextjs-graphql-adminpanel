/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QueryUsersOrderByInput, User_status, User_role } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: users
// ====================================================

export interface users_users_nodes {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  status: User_status;
  role: User_role;
}

export interface users_users {
  __typename: "QueryUsers_Connection";
  /**
   * Flattened list of User type
   */
  nodes: users_users_nodes[];
  totalCount: number;
}

export interface users {
  users: users_users;
}

export interface usersVariables {
  orderBy?: QueryUsersOrderByInput | null;
  first?: number | null;
  skip?: number | null;
}
