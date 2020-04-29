import React, { useRef, useEffect, useState } from 'react';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import { useBoxShadowStyles, useVisibleStyles } from '../styles/helpers';
import { useParentDimensions, useWindowSize } from '../hooks/layout';

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
    padding: 0,

    '& > div': {
      maxHeight: '100%'
    }
  },

  videoStream: ({ width, height }) => ({
    display: 'flex',
    width,
    height
  }),

  video: ({ width, height }) => ({
    width,
    height
  })
}));

const PeerView = ({ stream }) => {
  if (!stream) return null;

  const peerView = useRef(null);
  const video = useRef(null);

  const [dimensions, setDimensions] = useState();
  const windowSize = useWindowSize();

  const { video: { settings: { width, height } } } = stream.getInfo();

  useEffect(() => {
    const parentDimensions = useParentDimensions(peerView.current);
    const dimensions = resize(parentDimensions.width, parentDimensions.height, width, height);
    setDimensions(dimensions);
  }, [peerView, windowSize]);

  const classes = useStyles(dimensions || {});
  const visibleClasses = useVisibleStyles();
  const boxShadowClasses = useBoxShadowStyles();

  useEffect(() => {
    video.current.srcObject = stream;
  }, []);

  return (
    <div
      ref={peerView}
      className={classnames({
        [visibleClasses.notVisible]: !dimensions,
        [visibleClasses.visible]: dimensions
      }, classes.videoStream, boxShadowClasses.boxShadow)}
    >
      <video
        autoPlay
        ref={video}
        className={classnames(classes.video)}
      />
    </div>
  );
};

const resize = (pW, pH, w, h) => {
  const d = {
    width: pW,
    height: h * (pW / w)
  };

  if (d.height > pH) {
    const r = pH / d.height;
    d.height = pH;
    d.width = d.width * r;
  }

  return d;
};

const PeersView = ({ peers = [] }) => {
  const classes = useStyles();
  const streams = peers.map(peer => Array.from(peer.streams.values()).map(({ stream }) => stream)).flat();

  const xs = streams.length === 1 ? true : 'auto';

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={1}
        justify="space-around"
        alignContent="stretch"
        className={classes.peersGrid}
      >
        {streams.map(stream =>
          ([
            <Grid
              item
              xs={xs}
              container
              justify="center"
              alignItems="center"
              key={stream.id}
              className={classes.gridItem}
            >
              <PeerView stream={stream} />
            </Grid>,
            <Grid
              item
              xs={xs}
              container
              justify="center"
              alignItems="center"
              key={stream.id + 'thet'}
              className={classes.gridItem}
            >
              <PeerView stream={stream} />
            </Grid>
          ])
        ).flat()}
      </Grid>
    </div>
  );
};

export default PeersView;
