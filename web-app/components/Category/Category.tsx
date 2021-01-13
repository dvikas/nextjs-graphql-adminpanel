import React, { useState } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/react-hooks';
import MaterialTable from 'material-table';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';

import { UPDATE_CATEGORY_MUTATION, DELETE_CATEGORY_MUTATION } from './CategoryMutation';
import Message, { TOGGLE_SNACKBAR_MUTATION } from '../Material/SuccessMessage';
import { GET_CATEGORIES } from './CategoryQuery'
import { UPDATE_CATEGORY_MUTATION as catMutation, UPDATE_CATEGORY_MUTATIONVariables } from '../../graphql/generated/UPDATE_CATEGORY_MUTATION';
import { ParentCategories } from './ParentCategories'


const Category: React.FC = () => {
    const { data, error, loading } = useQuery(GET_CATEGORIES);
    const [messageMutation] = useMutation(TOGGLE_SNACKBAR_MUTATION);

    const [nameError, setNameError] = useState({
        error: false,
        label: '',
        helperText: '',
    });


    const [deleteCategoryMutation] = useMutation<catMutation, UPDATE_CATEGORY_MUTATIONVariables>(DELETE_CATEGORY_MUTATION, {
        // onError: (error) => {
        // },
        // onCompleted: (data) => {
        // },
        // refetchQueries: {
        // },
        update(cache, result: any) {
            const deletedId = result.data.deleteCategory.id;
            // 1. Read the cache from the items we want
            const data: any = cache.readQuery({ query: GET_CATEGORIES });

            // 2. Filter the deleted item
            data.categories.nodes = data.categories.nodes.filter((item: any) => item.id !== deletedId);
        }
    });

    const [updateCategoryMutation] = useMutation<catMutation, UPDATE_CATEGORY_MUTATIONVariables>(UPDATE_CATEGORY_MUTATION, {
        // onError: (error) => {
        // },
        // onCompleted: (data) => {
        // },
        // refetchQueries: {
        // },
        update(cache, result) {
            const data: any = cache.readQuery({ query: GET_CATEGORIES });
            const returnedData = { ...result.data }
            const returnedDataValue: any = Object.values(returnedData)[0]
            data.categories.nodes.map((item: any) => {
                if (item.id === returnedDataValue.id) {
                    item.name = returnedDataValue.name
                    item.slug = returnedDataValue.slug
                    item.parent = returnedDataValue.parent
                }
            });
        }
    });

    if (!loading) {
        return (
            <div>
                <Message />
                <Link href="add-category">
                    <Button
                        color="primary"
                        startIcon={<Add />}
                    >
                        Add new category
                    </Button>
                </Link>
                <MaterialTable
                    title="Categories"
                    options={{ headerStyle: { zIndex: 1, fontWeight: 600, textTransform: 'uppercase' } }}
                    // isLoading={true}
                    localization={{
                        body: { editRow: { deleteText: 'Are you sure you want to delete this Category?' } }, header: { actions: '' }
                    }}
                    columns={
                        [
                            {
                                title: 'Name', field: 'name',
                                headerStyle: { color: '' },
                                editComponent: (props) => (
                                    <TextField
                                        type="text"
                                        error={nameError.error}
                                        helperText={nameError.helperText}
                                        value={props.value ? props.value : ''}
                                        onChange={e => props.onChange(e.target.value)}
                                    />
                                )
                            },
                            {
                                title: 'Slug', field: 'slug'
                            },
                            {
                                title: 'Parent Category', field: 'parent', lookup: ParentCategories,
                            }
                        ]}
                    data={data.categories.nodes}
                    editable={{
                        onRowUpdate: (newData: any, oldData: any) => {
                            const dt = new Promise((resolve, reject) => {
                                console.log(newData);
                                if (newData.name === '') {
                                    setNameError({
                                        error: true,
                                        label: 'required',
                                        helperText: 'required'
                                    });
                                    reject();
                                    return;
                                }
                                updateCategoryMutation({
                                    variables: {
                                        // id: Object.values(newData)[0],
                                        id: newData.id,
                                        name: newData.name,
                                        parent: newData.parent,
                                        slug: newData.slug
                                    }
                                }).then(data => {
                                    messageMutation({
                                        variables: { msg: 'Updated successfully', type: 'success' }
                                    })
                                    resolve(true);
                                }).catch(err => {
                                    messageMutation({
                                        variables: { msg: err.message, type: 'error' }
                                    })
                                    resolve(false);
                                });
                            })
                            return dt
                        },
                        onRowDelete: (oldData: any) => {
                            const dt = new Promise((resolve) => {
                                deleteCategoryMutation({
                                    variables: { id: oldData.id }
                                }).then(data => {
                                    messageMutation({
                                        variables: { msg: 'Deleted successfully', type: 'success' }
                                    })
                                    resolve(true);
                                }).catch(err => {
                                    messageMutation({
                                        variables: { msg: err.message, type: 'error' }
                                    })
                                    resolve(false);
                                });
                            });
                            return dt;
                        }
                    }
                    }
                />
            </div>
        );
    } else {
        return (<div>Loading</div>)
    }
};

export default Category;
