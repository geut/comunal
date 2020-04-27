import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#535c9c'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          height: '100%',
          minHeight: '100vh',
          display: 'flex'
        },
        '#root': {
          flex: 1
        }
      }
    }
  }
});

export default theme;
