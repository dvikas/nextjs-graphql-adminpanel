/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetPasswordMutation
// ====================================================

export interface ResetPasswordMutation_resetPassword {
  __typename: "User";
  email: string;
}

export interface ResetPasswordMutation {
  resetPassword: ResetPasswordMutation_resetPassword;
}

export interface ResetPasswordMutationVariables {
  resetToken: string;
  password: string;
  confirmPassword: string;
}
