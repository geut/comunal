import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { getUserMedia } from '../lib/media';

import { useConnection } from '../hooks/swarm';

import { FullSpace } from '../components/Layout';
import Sidebar from '../components/Sidebar';
import UserView from '../components/UserView';
import PeersView from '../components/PeersView';
import PeersIndicator from '../components/PeersIndicator';
import StreamIndicator from '../components/StreamIndicator';

import { notVisible, visible } from '../styles/helpers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    background: 'linear-gradient(15deg, rgba(79,81,134,1) 6%, rgba(76,145,188,1) 58%, rgba(90,186,151,1) 100%)',
    '& > .hideable': notVisible,
    '&:hover > .hideable': visible
  }
}));

const Meeting = () => {
  const classes = useStyles();
  const { meetingId } = useParams();

  const [userStreams, setUserStreams] = useState({});

  const { swarm, peers } = useConnection(meetingId);

  useEffect(() => {
    if (!swarm) return;

    Object.values(userStreams).forEach(stream => {
      if (swarm.streams.has(stream.id)) return;
      swarm.addStream(stream);
    });

    return () => {
      Object.values(userStreams).forEach(stream => {
        swarm.removeStream(stream);
      });
    };
  }, [swarm, userStreams]);

  const handleRequestShareCamera = useCallback(async () => {
    if (localStorage.noVideo) return;

    const stream = await getUserMedia();

    setUserStreams(streams => ({
      ...streams,
      [stream.id]: stream
    }));
  }, []);

  useEffect(() => {
    handleRequestShareCamera();
  }, []);

  return (
    <FullSpace className={classes.root}>
      <Sidebar className='hideable'>
        <PeersIndicator peers={Object.values(peers)} />
        <StreamIndicator streams={Object.values(userStreams)} />
      </Sidebar>
      <PeersView peers={Object.values(peers).filter(Boolean)} />
      <UserView streams={Object.values(userStreams)} />
    </FullSpace>
  );
};

export default Meeting;
