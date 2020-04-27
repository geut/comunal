import React from 'react';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    display: 'flex',
    padding: '0',
    maxWidth: '-webkit-fill-available',
    minHeight: '100%',
    flexDirection: 'column'
  },
  centered: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fullSpace: {
    flex: 1,
    display: 'flex'
  }
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      {children}
    </Container>
  );
};

export const Centered = ({ className, children }) => {
  const classes = useStyles();
  return (
    <div className={classnames(classes.centered, className)}>
      {children}
    </div>
  );
};

export const FullSpace = ({ className, children }) => {
  const classes = useStyles();
  return (
    <div className={classnames(classes.fullSpace, className)}>
      {children}
    </div>
  );
};

export default Layout;
