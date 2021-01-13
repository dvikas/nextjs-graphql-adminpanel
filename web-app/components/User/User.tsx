import React, { useState } from 'react';
// import styled from '@emotion/styled';
// import ApolloClient from 'apollo-client';
// import Link from 'next/link';
import { useApolloClient, useQuery, useMutation } from '@apollo/react-hooks';
import MaterialTable from 'material-table';
import TextField from "@material-ui/core/TextField";
// import Button from '@material-ui/core/Button';
// import Add from '@material-ui/icons/Add';
// import logoPng from '../../assets/icons/logo.png';
// import { customTheme } from '../../utils/styles/theme';
import { UPDATE_USER_MUTATION, DELETE_USER_MUTATION } from './UserMutation';
import Message, { TOGGLE_SNACKBAR_MUTATION } from '../Material/SuccessMessage';
import { USER_PERMISSIONS } from './UserQuery'
import { UPDATE_USER_MUTATION as userMutation, UPDATE_USER_MUTATIONVariables } from '../../graphql/generated/UPDATE_USER_MUTATION';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const ParentCategories = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    USER: 'USER'
}

const UserStatus = {
    INACTIVE: 'INACTIVE',
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED'
}

const Category: React.FC = () => {
    const { data, error, loading } = useQuery(USER_PERMISSIONS);
    const [messageMutation] = useMutation(TOGGLE_SNACKBAR_MUTATION);
    const [nameError, setNameError] = useState({
        error: false,
        label: '',
        helperText: '',
    });

    const [deleteUserMutation] = useMutation<userMutation, UPDATE_USER_MUTATIONVariables>(DELETE_USER_MUTATION, {
        // onError: (error) => {
        // },
        // onCompleted: (data) => {
        // },
        // refetchQueries: {
        // },
        update(cache, result: any) {
            const deletedId = result.data.deleteAccount.id;
            // 1. Read the cache from the items we want
            const data: any = cache.readQuery({ query: USER_PERMISSIONS });
            // 2. Filter the deleted item
            data.users.nodes = data.users.nodes.filter((item: any) => item.id !== deletedId);
        }
    });

    const [updateCategoryMutation] = useMutation<userMutation, UPDATE_USER_MUTATIONVariables>(UPDATE_USER_MUTATION, {
        // onError: (error) => {
        // },
        // onCompleted: (data) => {
        // },
        // refetchQueries: {
        // },
        update(cache, result) {
            const data: any = cache.readQuery({ query: USER_PERMISSIONS });
            const returnedData = { ...result.data }
            const returnedDataValue: any = Object.values(returnedData)[0]
            data.users.nodes.map((item: any) => {
                if (item.id === returnedDataValue.id) {
                    item.name = returnedDataValue.name
                    item.email = returnedDataValue.email
                    item.status = returnedDataValue.status
                    item.role = returnedDataValue.role
                }
            });
        }
    });

    if (!loading) {
        return (
            <div>
                <Message />

                <MaterialTable
                    title="Users"
                    options={{ headerStyle: { zIndex: 1, fontWeight: 600, textTransform: 'uppercase' } }}
                    // isLoading={true}
                    localization={{
                        body: { editRow: { deleteText: 'Are you sure you want to delete this User?' } }, header: { actions: '' }
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
                                title: 'Email', field: 'email'
                            },
                            {
                                title: 'Role', field: 'role', lookup: ParentCategories,
                            },
                            {
                                title: 'Status', field: 'status', lookup: UserStatus,
                            }
                        ]}
                    data={data.users.nodes}
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
                                    variables: newData
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

                                deleteUserMutation({
                                    variables: oldData
                                }).then(data => {
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
