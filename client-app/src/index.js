import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import theme from './styles/theme';

import App from './containers/App';

// import hypercore from 'hypercore';
// import storage from 'random-access-idb';

// const feed = hypercore(storage('thet'), { valueEncoding: 'utf-8' });

// feed.append('hola', () => {
//   feed.get(0, console.log);
// });

const root = document.getElementById('root');

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  root
);
