import {
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
      margin: '0 auto',
    },
    uploadButton: {
      paddingLeft: '20px',
      paddingRight: '20px'
    },
    textField: {
      '& > *': {
        width: '100%',
      },
    },
    submitButton: {
      marginTop: '24px',
      textAlign: 'right'
    },
    FileContainer: {
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'sans-serif'
    },
    thumbsContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16
    },
    thumb: {
      display: 'inline-flex',
      borderRadius: 2,
      border: '1px solid #eaeaea',
      marginBottom: 8,
      marginRight: 8,
      width: 100,
      height: 100,
      padding: 4,
      boxSizing: 'border-box'
    },
    thumbInner: {
      display: 'flex',
      minWidth: 0,
      overflow: 'hidden'
    },
    img: {
      display: 'block',
      width: 'auto',
      height: '100%'
    },
    media: {
      padding: '0 5px',
      height: '100px',
      textAlign: 'center',
      marginTop: '10px',
      margin: '0 auto',
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
    gridList: {
      width: 350,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
  })
)