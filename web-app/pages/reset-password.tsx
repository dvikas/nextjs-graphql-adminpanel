import React, { useState } from 'react';

import { Formik, Form, FormikConfig } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { signupPasswordValidationSchema } from '../components/LoginOrSignup/LoginOrSignup';
import { requestResetPasswordMutation, resetPasswordMutation } from '../graphql/mutations';
import { PageProps } from './_app';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import NextLink from 'next/link';

import { makeStyles } from '@material-ui/core/styles';

import Message, { TOGGLE_SNACKBAR_MUTATION } from '../components/Material/SuccessMessage';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginLeft: theme.spacing(8),
        marginRight: theme.spacing(8),
        padding: '30px',
        border: '1px solid lightgrey',
        borderRadius: '5px'
    },
    forgotPasswordEmail: {
        marginTop: theme.spacing(3),
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

type ResetPasswordFormSchema = Yup.InferType<typeof signupPasswordValidationSchema>;

const initialResetPasswordFormValues: ResetPasswordFormSchema = { password: '', confirmPassword: '' };

const requestPasswordResetFormSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
});

type RequestPasswordResetFormSchema = Yup.InferType<typeof requestPasswordResetFormSchema>;

const initialRequestPasswordResetFormValues: RequestPasswordResetFormSchema = { email: '' };

type Props = {} & PageProps;

const ResetPassword: React.FC<Props> = ({ query }) => {
    // const toast = useToast();
    const router = useRouter();
    const classes = useStyles();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const shouldDisplayResetPassword = query && query.resetToken !== undefined;
    const [messageMutation] = useMutation(TOGGLE_SNACKBAR_MUTATION);

    const [requestResetPassword, { loading: loadingRequestResetPassword }] = useMutation(requestResetPasswordMutation, {
        onError: (error) => {
            messageMutation({
                variables: { msg: error.graphQLErrors[0].message, type: 'error' }
            })
        },
        onCompleted: () => {
            messageMutation({
                variables: { msg: 'You should receive a password reset link in your email', type: 'success' }
            })
            router.push('/login');
        },
    });
    const [resetPassword, { loading: loadingResetPassword }] = useMutation(resetPasswordMutation, {
        onError: (error) => {
            messageMutation({
                variables: { msg: error.graphQLErrors[0].message, type: 'error' }
            })
        },
        onCompleted: () => {
            messageMutation({
                variables: { msg: 'Your password has been successfully updated', type: 'success' }
            })
            router.push('/login');
        },
    });

    const handleResetPassword: FormikConfig<ResetPasswordFormSchema>['onSubmit'] = async (
        values,
        { setSubmitting }
    ) => {
        await resetPassword({
            variables: {
                password: values.password,
                confirmPassword: values.confirmPassword,
                resetToken: query && query.resetToken,
            },
        });
        setSubmitting(false);
    };

    const handleResetPasswordRequest: FormikConfig<RequestPasswordResetFormSchema>['onSubmit'] = async (
        values,
        { setSubmitting }
    ) => {
        await requestResetPassword({
            variables: {
                email: values.email,
            },
        });
        setSubmitting(false);
    };

    return shouldDisplayResetPassword ? (
        <>
            <Message />
            <Container component="main" maxWidth="sm">
                <Message />
                <Paper elevation={5} className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Reset password
                     </Typography>
                    <Box color="primary.main" mt={3} component="div">
                        Set a new password for your account.</Box>
                    <Formik
                        initialValues={initialResetPasswordFormValues}
                        onSubmit={handleResetPassword}
                        validationSchema={signupPasswordValidationSchema}
                    >
                        {({ values, handleChange, handleBlur, errors, touched }): JSX.Element => (
                            <Form id={'reset-password'}>
                                <TextField
                                    margin="normal"
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    value={values.password}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    error={errors.password !== undefined && touched.password}
                                    autoComplete="current-password"
                                    helperText={errors.password !== undefined && touched.password ? errors.password : ''}
                                />

                                <TextField
                                    margin="normal"
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    value={values.confirmPassword}
                                    name="confirmPassword"
                                    label="Confirm password"
                                    type="password"

                                    error={errors.confirmPassword !== undefined && touched.confirmPassword}
                                    autoComplete="current-password"
                                    helperText={errors.confirmPassword !== undefined && touched.confirmPassword ? errors.confirmPassword : ''}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={loadingResetPassword}
                                >
                                    {loadingRequestResetPassword ? <span>Loading...</span> : <span>Set new password</span>}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <Grid container>
                        <Grid item xs>
                            <NextLink href="login" passHref>
                                ⬅ Go back to Login</NextLink>
                        </Grid>
                    </Grid>
                </Paper>

            </Container>
        </>
    ) : (
            <Container component="main" maxWidth="sm">
                <Message />
                <Paper elevation={5} className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Forgot password
                     </Typography>

                    <Formik
                        initialValues={initialRequestPasswordResetFormValues}
                        validationSchema={requestPasswordResetFormSchema}
                        onSubmit={handleResetPasswordRequest}
                    >
                        {({ values, handleBlur, handleChange, errors, touched }): JSX.Element => (
                            <Form id="request-reset-password">

                                <Box color="primary.main" mt={3} component="div">
                                    Enter your email in order to receive a link to reset your password.
                                </Box>
                                <TextField
                                    className={classes.forgotPasswordEmail}
                                    margin="normal"
                                    required
                                    fullWidth
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    value={values.email}
                                    autoComplete="email"
                                    autoFocus
                                    error={errors.email ? true : false}
                                    helperText={errors.email !== undefined && touched.email ? errors.email : ''}

                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={loadingRequestResetPassword}
                                >
                                    {loadingRequestResetPassword ? <span>Loading...</span> : <span>Reset password</span>}
                                </Button>

                            </Form>
                        )}
                    </Formik>
                    <Grid container>
                        <Grid item xs>
                            <NextLink href="/login" passHref>
                                ⬅ Go back to Login</NextLink>
                        </Grid>
                    </Grid>
                </Paper>

            </Container>

        );
};

export default ResetPassword;
