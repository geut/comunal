import React from 'react';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: ({ width }) => ({
    zIndex: 2,
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#00000030'
  })
}));

const Sidebar = ({ width = 64, className, children }) => {
  const classes = useStyles({ width });
  return (
    <div className={classnames(classes.root, className)}>
      {children}
    </div>
  );
};

export default Sidebar;
