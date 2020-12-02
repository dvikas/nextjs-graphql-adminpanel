import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 200,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    title: {
      fontSize: '14px',
      height: '35px',
      overflow: 'hidden',
      lineHeight: '1.3em',
      textOverflow: 'ellipsis',
      color: '#161f6a',
      // color: theme.palette.primary.dark,
      fontWeight: theme.typography.fontWeightMedium,
      textAlign: 'center'
    },
    subheader: {
      fontSize: '12px',
      marginTop: '5px',
      textAlign: 'center'
    },
    cardContent: {
      paddingTop: 0,
    },
    discountedPrice: {
      paddingTop: 0,
      color: theme.palette.primary.dark
    },
    price: {
      marginLeft: '10px',
      color: theme.palette.grey[500],
      fontSize: '12px',
      textDecoration: 'line-through'
    },
    media: {
      // height: '240px',
      height: '120px',
      width: 120,
      textAlign: 'center',
      marginTop: '10px',
      margin: '0 auto',
      // paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
    parentImageContainer: {
      position: 'relative'
    },
    discountInPercent: {
      // ...$theme.typography.fontBold12,
      color: '#ffffff',
      lineHeight: '1.7',
      backgroundColor: theme.palette.secondary.main,
      paddingLeft: '7px',
      paddingRight: '7px',
      display: 'inline-block',
      position: 'absolute',
      bottom: '10px',
      right: '0',
      fontSize: '12px',
      fontWeight: theme.typography.fontWeightMedium,
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '-8px',
        top: '0',
        width: '0',
        height: '0',
        borderStyle: 'solid',
        borderWidth: '0 8px 12px 0',
        borderColor: `transparent ${theme.palette.secondary.main} transparent transparent`,
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        left: '-8px',
        bottom: ' 0',
        width: ' 0',
        height: '0',
        borderStyle: 'solid',
        borderWidth: '0 0 12px 8px',
        borderColor: `transparent transparent ${theme.palette.secondary.main}`,
      },
    },
    appBar: {
      position: 'relative',
    },
    dialogTitle: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    drawerOpen: {
      color: 'red'
    },
    drawerClose: {
      position: 'relative!important' as any
    },
    newProduct: {
      bottom: theme.spacing(2),
      position: 'fixed',
      right: theme.spacing(2)
    },
    filterBox: {
      // marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      // padding: theme.spacing(2)
    },
    pagination: {
      padding: theme.spacing(2)
    },
    searchInput: {
      padding: theme.spacing(1)
    },
    searchBar: {
      background: theme.palette.grey[100],
      borderWidth: '1px',
      boxShadow: theme.shadows[0],
      marginBottom: theme.spacing(2),
      borderColor: theme.palette.primary.main,
      borderRadius: '5px',
    },
    searchLegend: {
      ...theme.typography.subtitle1,
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      // borderRadius: '10%',
      fontWeight: theme.typography.fontWeightRegular
    }
  }),
);