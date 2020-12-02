import React, { useState } from 'react'
import {
    Grid,
    TextField,
    Button,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Formik, Form, FormikProps } from 'formik'
import * as Yup from 'yup'

import uuidv4 from 'uuid/v4';
import { useRouter } from 'next/router';
import { useApolloClient, useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { createCategory, createCategoryVariables } from '../../graphql/generated/createCategory';
import { GET_CATEGORIES } from './CategoryQuery'
import { CREATE_CATEGORY } from './CategoryMutation'
import Message, { TOGGLE_SNACKBAR_MUTATION } from '../Material/SuccessMessage';
import { ParentCategoriesWithIcon as ParentCategories } from './ParentCategories'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: '450px',
            display: 'block',
            margin: '0 auto',
        },
        textField: {
            '& > *': {
                width: '100%',
            },
        },
        submitButton: {
            marginTop: '24px',
        },
        title: { textAlign: 'center', fontWeight: 400, fontSize: '22px' },
        successMessage: { color: 'green' },
        errorMessage: { color: 'red' },
    })
)


// interface ParentCatType {
//     name: string
//     label: string
//     icon: string
// }
// interface newCat {
//     id: string
//     name: string
//     parent: string
//     slug: string
// }
interface NewCategoryForm {
    catName: string
    slug: string
    parentCategory: string
}

//https://medium.com/make-it-heady/react-typescript-hooks-form-validation-with-formik-yup-and-material-ui-d4901efc0096
const AddCategory: React.FunctionComponent = () => {
    const classes = useStyles();
    const router = useRouter();
    const [displayFormStatus, setDisplayFormStatus] = useState(false)
    // const [formStatus, setFormStatus] = useState<IFormStatus>({
    //     message: '',
    //     type: '',
    // })
    const [messageMutation] = useMutation(TOGGLE_SNACKBAR_MUTATION);

    useQuery(GET_CATEGORIES);

    const [createCategory] = useMutation<createCategory, createCategoryVariables>(CREATE_CATEGORY, {
        // onError: (error) => {
        // },
        onCompleted: (data) => {
            router.push('/categories');
        },
        update(cache, { data }) {
            const cacheData: any = cache.readQuery({ query: GET_CATEGORIES });
            if (data) {
                cacheData.categories.nodes.push(data.createCategory)
            }
        }
    });

    const createNewCategory = async (data: NewCategoryForm, resetForm: Function) => {

        // API call integration will be here. Handle success / error response accordingly.
        if (data) {
            // console.log('form submitted', data)
            const newCategory = {
                id: uuidv4(),
                name: data.catName,
                slug: data.slug,
                parent: data.parentCategory,
                creation_date: new Date(),
            };
            createCategory({
                variables: newCategory
            }).then(data => {
                console.log('then of createCategory')
                messageMutation({
                    variables: { msg: 'Category added successfully', type: 'success' }
                })
            }).catch(err => {
                console.log('error of createCategory')
                messageMutation({
                    variables: { msg: err.message, type: 'error' }
                })
            });

            // setFormStatus(formStatusProps.success)
            // resetForm({})
        }

    }

    return (
        <div className={classes.root}>


            <Formik
                initialValues={{
                    catName: '',
                    slug: '',
                    parentCategory: ''
                }}
                onSubmit={(values: NewCategoryForm, actions) => {
                    createNewCategory(values, actions.resetForm)
                    setTimeout(() => {
                        actions.setSubmitting(false)
                    }, 500)
                }}
                validationSchema={Yup.object().shape({

                    catName: Yup.string().required('Please enter category name'),
                    slug: Yup.string().required('Please enter slug'),
                    parentCategory: Yup.string().required('Please select parent category'),
                })}
            >
                {(props: FormikProps<NewCategoryForm>) => {
                    const {
                        values,
                        touched,
                        errors,
                        handleBlur,
                        setFieldValue,
                        handleChange,
                        isSubmitting,
                    } = props
                    return (
                        <Form>

                            <Grid
                                container
                                justify="space-around"
                                direction="row"
                            >

                                <Grid
                                    item
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.textField}
                                >
                                    <TextField
                                        name="catName"
                                        id="catName"
                                        label="Category Name"
                                        value={values.catName}
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        helperText={
                                            errors.catName && touched.catName
                                                ? errors.catName
                                                : 'Enter category name.'
                                        }
                                        error={
                                            errors.catName && touched.catName
                                                ? true
                                                : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.textField}
                                >
                                    <TextField
                                        name="slug"
                                        id="slug"
                                        label="Slug"
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        value={values.slug}
                                        type="text"
                                        helperText={
                                            errors.slug && touched.slug
                                                ? errors.slug
                                                : 'Enter slug.'
                                        }
                                        error={
                                            errors.slug && touched.slug
                                                ? true
                                                : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Grid>


                                <Grid item style={{ paddingTop: 15, paddingBottom: 20 }}
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.textField}>
                                    <Autocomplete
                                        style={{}}
                                        options={ParentCategories}
                                        autoHighlight
                                        onChange={(e, value) => {
                                            if (value !== null && typeof value === 'object') {
                                                setFieldValue('parentCategory', value.name);
                                            }
                                        }}
                                        getOptionLabel={(option) => option.label}
                                        renderOption={(option) => (
                                            <React.Fragment>
                                                <span>{option.icon}</span>
                                                {option.label}
                                            </React.Fragment>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                helperText={
                                                    errors.parentCategory && touched.parentCategory
                                                        ? errors.parentCategory
                                                        : 'Select parent category.'
                                                }
                                                error={
                                                    errors.parentCategory && touched.parentCategory
                                                        ? true
                                                        : false
                                                }
                                                label="Choose parent Category"
                                                variant="outlined"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'off', // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />

                                </Grid>



                                <Grid
                                    item
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.submitButton}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        disabled={isSubmitting}
                                    >
                                        Submit
                                    </Button>

                                </Grid>
                            </Grid>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default AddCategory;