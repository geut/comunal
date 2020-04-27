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

  videoStream: ({ min, max }) => ({
    flex: 1,
    overflow: 'hidden',
    paddingTop: `calc(${min} / ${max} * 100%)`
  }),

  videoSize: ({ width, height }) => ({
    width,
    height
  })
}));

const PeerView = ({ stream }) => {
  if (!stream) return null;

  // console.log(stream.getActiveVideoTrack().getSettings());
  // console.log(stream.getActiveVideoTrack().getConstraints());
  stream.events.on('track-update', track => console.log(track.getSettings()));
  stream.events.on('add-track', track => console.log(track.getSettings()));

  const { width, height } = stream.getActiveVideoTrack().getSettings();
  // console.log({
  //   min: Math.min(width, height),
  //   max: Math.min(width, height),
  //   width: width > height ? width : undefined,
  //   height: height > width ? height : undefined
  // });
  const classes = useStyles({
    min: Math.min(width, height),
    max: Math.min(width, height),
    width: width > height ? width : undefined,
    height: height > width ? height : undefined
  });
  const boxShadowClasses = useBoxShadowStyles();
  const video = useRef(null);

  useEffect(() => {
    video.current.srcObject = stream;
  }, []);

  return (
    <div className={classnames(classes.videoStream, classes.videoSize, boxShadowClasses.boxShadow)}>
      <video
        autoPlay
        ref={video}
      // className={classnames(classes.videoSize)}
      />
      {/* <div className={classnames(classes.videoSize)} style={{ backgroundColor: 'grey' }}>AAAA</div> */}
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
            <Grid item container xs className={classes.peersGridItem} key={stream.id}>
              <PeerView stream={stream} />
            </Grid>
          ))
        )).flat()}
      </Grid>
    </div>
  );
};

export default PeersView;
