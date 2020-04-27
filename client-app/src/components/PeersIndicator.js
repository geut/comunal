import React from 'react';

import { makeStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';

import PeopleTwoToneIcon from '@material-ui/icons/PeopleTwoTone';

const useStyles = makeStyles(theme => ({
  icon: {
    color: '#fff'
  }
}));

const PeersIndicator = ({ peers = [] }) => {
  const classes = useStyles();
  return (
    <IconButton aria-label="peers">
      <Badge color="primary" badgeContent={peers.length} >
        <PeopleTwoToneIcon fontSize="large" color="inherit" className={classes.icon} />
      </Badge>
    </IconButton>
  );
};

export default PeersIndicator;
