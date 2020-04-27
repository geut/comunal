import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import { useBoxShadowStyles } from '../styles/helpers';

const useStyles = makeStyles(theme => ({
  root: () => {
    return {
      zIndex: 1,
      position: 'absolute',
      top: theme.spacing(1),
      left: theme.spacing(1),
      width: `calc(100% - ${theme.spacing(2)}px)`,
      height: `calc(100% - ${theme.spacing(2)}px)`,
      display: 'flex'
    };
  },

  peersGrid: {
    padding: 0
  },

  peersGridItem: {

  },

  videoStream: ({ width, height }) => ({
    display: 'flex',
    width: 'auto',
    height
  }),

  videoSize: ({ width, height, min, max }) => ({
    // paddingTop: `calc(${min} / ${max} * 100%)`,
    width: 'auto',
    height: '-webkit-fill-available'
  })
}));

const PeerView = ({ stream }) => {
  if (!stream) return null;

  const { video: { settings: { width, height } } } = stream.getInfo();

  const classes = useStyles({
    min: Math.min(width, height),
    max: Math.max(width, height),
    width: width > height ? '100%' : undefined,
    height: height > width ? '100%' : undefined
  });
  const boxShadowClasses = useBoxShadowStyles();
  const video = useRef(null);

  useEffect(() => {
    video.current.srcObject = stream;
  }, []);

  return (
    <div className={classnames(classes.videoStream, boxShadowClasses.boxShadow)}>
      <video
        autoPlay
        ref={video}
        className={classnames(classes.videoSize)}
      />
    </div>
  );
};

const PeersView = ({ peers = [] }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={1}
        justify="space-around"
        alignContent="stretch"
        className={classes.peersGrid}
      >
        {peers.map(peer => (
          Array.from(peer.streams.values()).map(({ stream }) => (
            <Grid item container justify="center" alignItems="center" xs className={classes.peersGridItem} key={stream.id}>
              <PeerView stream={stream} />
            </Grid>
          ))
        )).flat()}
      </Grid>
    </div>
  );
};

export default PeersView;
