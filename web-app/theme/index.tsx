import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { purple } from '@material-ui/core/colors';

// Create a theme instance.
let theme = createMuiTheme({
  palette: {
    // type: 'dark', // For Dark Theme

    // primary: {
    //   main: purple[500],
    // },
    // secondary: {
    //   main: '#11cb5f',
    // },
    // error: {
    //   main: red.A400,
    // },
    background: {
      default: '#fff',
    },
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 14,
  },
});

theme.typography.h3 = {
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};
// theme = responsiveFontSizes(theme);

export default theme;