import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useApolloClient, useQuery, useMutation } from '@apollo/react-hooks';
import { SNACKBAR_STATE_QUERY } from '../../graphql/queries';
// import { TOGGLE_SNACKBAR_MUTATION } from '../../graphql/mutations';
import gql from 'graphql-tag';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Message = () => {
  const { data, error, loading } = useQuery(SNACKBAR_STATE_QUERY);
  const [toggleSnackBar] = useMutation(TOGGLE_SNACKBAR_MUTATION);
  if (!loading && data) {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={data.snackBarOpen}
        autoHideDuration={6000}
        onClose={() => toggleSnackBar({ variables: { msg: '', type: 'success' } })}
      ><Alert
        onClose={() => toggleSnackBar({ variables: { msg: '', type: 'success' } })}
        severity={data.snackType}>
          {data.snackMsg}
        </Alert></Snackbar>
    )
  } else {
    return <></>
  }
};

const TOGGLE_SNACKBAR_MUTATION = gql`
  mutation toggleSnackBar{
    toggleSnackBar(msg: $msg, type: $type) @client
  }
`;
export default Message;
export { SNACKBAR_STATE_QUERY, TOGGLE_SNACKBAR_MUTATION };