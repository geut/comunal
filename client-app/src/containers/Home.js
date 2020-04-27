import React, { useState, useEffect, useCallback, useRef } from 'react';
import Chance from 'chance';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { Centered } from '../components/Layout';

const chance = new Chance();

const useStyles = makeStyles(theme => ({
  centeredContainer: {
    background: 'linear-gradient(313deg, rgba(79,81,134,1) 6%, rgba(76,145,188,1) 58%, rgba(90,186,151,1) 100%)'
  },

  root: {
    width: '40%'
  },

  input: {
    border: 'none',
    width: '100%',
    height: '100%',
    backgroundColor: '#fafafa',
    color: '#4f5186',
    padding: `${theme.spacing()}px ${theme.spacing(2)}px`,
    fontSize: 24,
    fontFamily: '"Roboto"',

    '&::placeholder': {
      color: '#4f5186'
    }
  },

  button: {
    height: '100%',
    color: '#fafafa',
    backgroundColor: '#262c5f',
    fontSize: 24,
    borderRadius: 0,

    '&:hover': {
      backgroundColor: '#262c5f'
    }
  }
}));

const Home = () => {
  const classes = useStyles();
  const history = useHistory();

  const input = useRef(null);

  const [randomName, setRandomName] = useState(null);

  useEffect(() => {
    const randomName = `${chance.word()}-${chance.word()}-${chance.word()}`;
    setRandomName(randomName);
  }, []);

  const handleJoinMeeting = useCallback(() => {
    let name = input.current.value || '';

    name = name.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text

    if (name.length === 0) {
      name = randomName;
    }

    history.push(`/${name}`);
  }, [randomName]);

  return (
    <Centered className={classes.centeredContainer}>
      <Grid container spacing={0} className={classes.root}>
        <Grid item xs>
          <input
            placeholder={randomName}
            className={classes.input}
            ref={input}
          />
        </Grid>
        <Grid item xs={3}>
          <Button size="large" onClick={handleJoinMeeting} fullWidth className={classes.button}>GO</Button>
        </Grid>
      </Grid>
    </Centered>
  );
};

export default Home;
