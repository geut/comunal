import React, { useEffect, useRef, useCallback, useState, Fragment } from 'react';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';

import { useVisibleStyles, useBoxShadowStyles, notVisible, visible } from '../styles/helpers';
import { isCameraStream } from '../lib/media';

const useStyles = makeStyles(theme => ({
  root: ({ height }) => ({
    zIndex: 2,
    position: 'absolute',
    bottom: theme.spacing(1),
    width: `calc(100% - ${theme.spacing(2)}px)`,
    marginLeft: 'auto',
    marginRight: 'auto',
    height,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    '& .hideable': notVisible,
    '&:hover .hideable': visible
  }),

  fillSpace: {
    // TODO: SEE ORIENTATION (h > w or vs)
    height: '-webkit-fill-available',
    maxHeight: '-webkit-fill-available'
  },

  videoStream: {
    overflow: 'hidden'
  },

  videoSize: ({ width, height }) => ({
    width,
    height
  }),

  videoStreamActionButtons: {
    zIndex: 3,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: 'inherit',
    backgroundColor: '#00000030'
  },

  videoStreamActionButtonContainer: {
    textAlign: 'center'
  },

  icon: {
    color: '#fff'
  },
  iconMuted: {
    color: red[900]
  },
  iconDisabled: {
    color: grey[900],
    '&.video': {
      color: grey[200]
    }
  }
}));

const trackIcons = {
  video: {
    icon: VideocamIcon,
    offIcon: VideocamOffIcon
  },
  audio: {
    icon: MicIcon,
    offIcon: MicOffIcon
  }
};

const VideoStreamActionButtons = ({ stream }) => {
  const classes = useStyles();

  const [tracksStatus, setTracksStatus] = useState({
    audio: {},
    video: {}
  });

  useEffect(() => {
    const audio = stream.getActiveAudioTrack();
    const video = stream.getActiveVideoTrack();

    stream.events.on('track-update', (track, { kind }) => {
      setTracksStatus(tracksStatus => ({
        ...tracksStatus,
        [kind]: track
      }));
    });

    setTracksStatus(tracksStatus => ({
      ...tracksStatus,
      audio,
      video
    }));
  }, []);

  const handleTrackClick = useCallback(kind => () => {
    const track = tracksStatus[kind];
    track.setEnabled(!track.enabled);
  }, [tracksStatus]);

  return (
    <Grid
      container
      alignItems="center"
      className={classnames(classes.videoStreamActionButtons, 'hideable')}
    >
      {Object.entries(tracksStatus).map(([key, { enabled, muted, label }]) => {
        const Icon = (enabled && !muted)
          ? trackIcons[key].icon
          : trackIcons[key].offIcon;

        const tooltip = (enabled && !muted)
          ? `Using ${label}`
          : muted ? 'Muted' : 'Disabled';

        return (
          <Grid item xs={6} className={classes.videoStreamActionButtonContainer} key={key}>
            <Tooltip title={tooltip}>
              <span>
                <IconButton
                  aria-label="mute-mic"
                  onClick={handleTrackClick(key)}
                >
                  <Icon
                    fontSize="large"
                    color="inherit"
                    className={classnames(
                      classes.icon,
                      key,
                      {
                        [classes.iconMuted]: muted,
                        [classes.iconDisabled]: !enabled
                      }
                    )}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        );
      })}
    </Grid>
  );
};

const VideoStream = ({
  stream,
  boxSize
}) => {
  const { width, height, aspectRatio } = stream.getActiveVideoTrack().getSettings();

  let newWidth;
  let newHeight;
  if (width > height) {
    newHeight = boxSize;
    newWidth = boxSize * aspectRatio;
  } else {
    newHeight = boxSize * aspectRatio;
    newWidth = boxSize;
  }

  const classes = useStyles({ width: newWidth, height: newHeight });
  const boxShadowClasses = useBoxShadowStyles();

  const video = useRef(null);

  const [showActionButtons] = useState(isCameraStream(stream));

  useEffect(() => {
    video.current.srcObject = stream;
  }, []);

  return (
    <div className={classnames(classes.videoStream, classes.videoSize, boxShadowClasses.boxShadow)}>
      {showActionButtons && (
        <VideoStreamActionButtons
          className={'hideable'}
          stream={stream}
        />
      )}
      <video
        ref={video}
        muted={true}
        autoPlay
        className={classnames(classes.videoSize)}
      />
    </div>
  );
};

const MAX_BOX_HEIGHT = 150;
const UserView = ({ streams = [] }) => {
  const classes = useStyles({ height: MAX_BOX_HEIGHT });
  const visibleClasses = useVisibleStyles();

  const show = streams.length > 0;

  return (
    <div
      className={classnames(
        classes.root,
        {
          [visibleClasses.notVisible]: !show,
          [visibleClasses.visible]: show
        }
      )}
    >
      {streams.map(stream => {
        return (
          <VideoStream
            stream={stream}
            key={stream.id}
            boxSize={MAX_BOX_HEIGHT}
          />
        );
      })}
    </div>
  );
};

export default UserView;
