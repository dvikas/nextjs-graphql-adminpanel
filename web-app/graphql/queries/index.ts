import gql from 'graphql-tag';

export const currentUserQuery = gql`
    query CurrentUserQuery {
        me {
            id
            email
            name
            role
            hasVerifiedEmail
            hasCompletedOnboarding
        }
    }
`;

export const SNACKBAR_STATE_QUERY = gql`
  query snackbar {
    snackBarOpen @client
    snackMsg @client
     snackType @client
  }
`;

export const IS_LEFT_DRAWER_OPEN = gql`
  query isLeftDrawerOpen {
    isLeftDrawerOpen @client
  }
`;
