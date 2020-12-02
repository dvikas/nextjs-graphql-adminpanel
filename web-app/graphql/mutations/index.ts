import gql from 'graphql-tag';

export const deleteAccountMutation = gql`
    mutation DeleteAccountMutation($id: ID!) {
        deleteAccount(id: $id) {
            id
        }
    }
`;

export const loginMutation = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            email
        }
    }
`;

export const logoutMutation = gql`
    mutation LogoutMutation {
        logout
    }
`;

export const signupMutation = gql`
    mutation SignupMutation($name: String!, $email: String!, $password: String!, $confirmPassword: String!) {
        signup(name: $name, email: $email, password: $password, confirmPassword: $confirmPassword) {
            email
        }
    }
`;

export const requestResetPasswordMutation = gql`
    mutation RequestResetPasswordMutation($email: String!) {
        requestPasswordReset(email: $email)
    }
`;

export const resetPasswordMutation = gql`
    mutation ResetPasswordMutation($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
            email
        }
    }
`;

export const completeOnboardingMutation = gql`
    mutation CompleteOnboardingMutation {
        completeOnboarding
    }
`;

// export const TOGGLE_SNACKBAR_MUTATION = gql`
//   mutation toggleSnackBar{
//     toggleSnackBar(msg: $msg, type: $type) @client
//   }
// `;

// export const TOGGLE_LEFT_DRAWER_MUTATION = gql`
//   mutation toggleLeftDrawer{
//     toggleLeftDrawer(status: "") @client
//   }
// `;