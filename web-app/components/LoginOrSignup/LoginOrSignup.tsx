import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { Formik, Form, FormikConfig, FormikTouched, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { PageProps } from '../../pages/_app';
import Google from '../../assets/icons/google.svg';
import { signupMutation, loginMutation } from '../../graphql/mutations';
import { LoginMutation, LoginMutationVariables } from '../../graphql/generated/LoginMutation';
import { SignupMutation } from '../../graphql/generated/SignupMutation';
import Message, { TOGGLE_SNACKBAR_MUTATION } from '../Material/SuccessMessage';

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

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

interface SignupMutationVariables {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface GreetingProps {
    isloginError: boolean;
}

const Greeting: React.FC<GreetingProps> = ({ isloginError }) => {
    if (isloginError) {
        return <Grid container spacing={0}>
            <Grid item xs={12} >
                <Alert severity="error">Invalid email or password</Alert>
            </Grid>
        </Grid>
    } else {
        return <></>
    }
}
const loginFormSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

type LoginFormSchema = Yup.InferType<typeof loginFormSchema>;

const initialLoginFormikValues: LoginFormSchema = { email: 'vikas.nice@gmail.com', password: 'admin' };

export const signupPasswordValidationSchema = Yup.object().shape({
    password: Yup.string()
        .test('passwordTooShort', 'Password must be at least 8 characters long', (value) => /^.{8,}$/.test(value))
        .test('passwordTooLong', 'Password must be less than 50 characters in length', (value) =>
            /^.{0,50}$/.test(value)
        )
        .required('Password is required'),
    // Validation code taken from here: https://github.com/jaredpalmer/formik/issues/90#issuecomment-444476296
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const signupFormSchema = Yup.object()
    .shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
    })
    .concat(signupPasswordValidationSchema);

type SignupFormSchema = Yup.InferType<typeof signupFormSchema>;

const initialSignupFormikValues: SignupFormSchema = { name: '', email: '', password: '', confirmPassword: '' };

type Props = {
    isAuthenticationError?: boolean;
    isLogin?: boolean;
} & PageProps;

const LoginOrSignup: React.FC<Props> = ({ query, isAuthenticationError, pathname, isLogin = true }) => {
    const router = useRouter();
    // const toast = useToast();
    const classes = useStyles();

    const client = useApolloClient();
    const [state, setState] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isErrorDisplayed, setIsErrorDisplayed] = useState(isAuthenticationError);
    const [messageMutation] = useMutation(TOGGLE_SNACKBAR_MUTATION);

    const [login, { loading: isLoadingLogin }] = useMutation<LoginMutation, LoginMutationVariables>(loginMutation, {
        onError: (error) => {
            console.log('Error', error.graphQLErrors[0].message);

            messageMutation({
                variables: { msg: error.graphQLErrors[0].message, type: 'error' }
            })
        },
        onCompleted: () => {
            client.resetStore();
            window.location.href = '/'
        },
    });
    const [signup, { loading: isLoadingSignup }] = useMutation<SignupMutation, SignupMutationVariables>(
        signupMutation,
        {
            onError: (error) => {
                console.log('Error', error);
                // messageMutation({
                //     variables: { msg: error.errors[0].message, type: 'error' }
                // })
            },
            onCompleted: () => {
                messageMutation({
                    variables: { msg: `Click the link in your email to verify your account`, type: 'success' }
                })
                client.resetStore();
                // router.push('/');
                window.location.href = '/'
            },
        }
    );

    if (isErrorDisplayed) {
        messageMutation({
            variables: { msg: `There's an issue with your authentication`, type: 'error' }
        })
        setIsErrorDisplayed(false);
    }

    useEffect(() => {
        // If there are any URL query params, remove them by replacing the current route with one without query params
        // This is to avoid sharing login URLs with error query params
        if (query && Object.entries(query).length > 0) {
            // Shallow replace allows us to bypass the getInitialProps call for this component, which would
            // remove the login page error
            router.replace(pathname as string, pathname as string, { shallow: true });
        }
    }, [isErrorDisplayed, pathname, query, router]);

    const loginOrSignupText = isLogin ? 'Log in' : 'Sign up';
    const formId = isLogin ? 'loginForm' : 'signupForm';
    const formSchema = isLogin ? loginFormSchema : signupFormSchema;
    const initialFormikValues = isLogin ? initialLoginFormikValues : initialSignupFormikValues;

    const handleSubmit: FormikConfig<LoginFormSchema | SignupFormSchema>['onSubmit'] = async (
        values,
        { setSubmitting }
    ) => {
        if (!isLogin) {
            signup({
                variables: {
                    name: (values as SignupFormSchema).name,
                    email: values.email,
                    password: values.password,
                    confirmPassword: (values as SignupFormSchema).confirmPassword,
                },
            });
        }
        if (isLogin) {
            login({
                variables: {
                    email: values.email,
                    password: values.password,
                },
            });
        }
        setSubmitting(false);
    };

    return (
        <>
            <Message />

            <Container component="main" maxWidth="sm">

                <Paper elevation={5} className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                     </Typography>

                    <Greeting isloginError={state} />
                    <Formik initialValues={initialFormikValues} onSubmit={handleSubmit} validationSchema={formSchema}>
                        {({ values, handleChange, handleBlur, errors, touched }): JSX.Element => (

                            <Form >
                                {!isLogin && (
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        id="name"
                                        label="Name"
                                        name="name"
                                        value={(values as SignupFormSchema).name}
                                        autoFocus
                                        error={(values as SignupFormSchema).name ? true : false}
                                    />
                                )}
                                <TextField
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
                                />
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
                                    error={errors.password ? true : false}
                                    autoComplete="current-password"
                                    helperText={(errors as FormikErrors<SignupFormSchema>).password !== undefined && (touched as FormikTouched<SignupFormSchema>).password ? (errors as FormikErrors<SignupFormSchema>).password : ''}
                                />

                                {!isLogin && (
                                    <>
                                        <TextField
                                            margin="normal"
                                            required
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            value={(values as SignupFormSchema).confirmPassword}
                                            name="confirmPassword"
                                            label="Confirm password"
                                            type="password"
                                            id="confirmPassword"
                                            error={(errors as SignupFormSchema).confirmPassword !== undefined &&
                                                (touched as FormikTouched<SignupFormSchema>).confirmPassword}
                                            autoComplete="current-password"
                                            helperText={(errors as FormikErrors<SignupFormSchema>).confirmPassword !== undefined && (touched as FormikTouched<SignupFormSchema>).confirmPassword ? (errors as FormikErrors<SignupFormSchema>).confirmPassword : ''}

                                        />
                                    </>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={isLoadingSignup}
                                >
                                    {isLoadingSignup ? <span>Loading...</span> : <span>{loginOrSignupText}</span>}
                                </Button>
                                <Grid container>
                                    {isLogin && (
                                        <Grid item xs>
                                            <NextLink href="reset-password" passHref>
                                                Forgot password?
                                        </NextLink>
                                        </Grid>
                                    )}
                                    <Grid item>
                                        {isLogin ? (
                                            <>
                                                {`Don't have an account? `}
                                                <NextLink href="signup" passHref>
                                                    {" Sign Up"}
                                                </NextLink>
                                            </>
                                        ) : (
                                                <>
                                                    Already have an account?{' '}
                                                    <NextLink href="login" passHref>
                                                        <Link>Log in</Link>
                                                    </NextLink>
                        .
                    </>
                                            )}

                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Paper>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default LoginOrSignup;
