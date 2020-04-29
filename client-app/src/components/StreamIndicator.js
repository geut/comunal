import React, { useEffect, useState, useCallback } from 'react';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core';
// import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import MicIcon from '@material-ui/icons/MicTwoTone';
import MicOffIcon from '@material-ui/icons/MicOffTwoTone';
import VideocamIcon from '@material-ui/icons/VideocamTwoTone';
import VideocamOffIcon from '@material-ui/icons/VideocamOffTwoTone';
import ScreenShare from '@material-ui/icons/ScreenShareTwoTone';
import StopScreenShare from '@material-ui/icons/StopScreenShareTwoTone';

import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';

import { STREAM_CAMERA, STREAM_SCREEN_SHARE } from '../lib/media';

const useStyles = makeStyles(theme => ({
  icon: {
    color: '#fff'
  },
  iconMuted: {
    color: red[900]
  },

  iconDisabled: {
    color: grey[900]
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
  },
  screen: {
    icon: ScreenShare,
    offIcon: StopScreenShare
  }
};

const StreamIndicator = ({
  streams = [],
  onAudioChange,
  onVideoChange
}) => {
  const classes = useStyles();

  const [tracksStatus, setTracksStatus] = useState({
    audio: {},
    video: {},
    screen: {}
  });

  useEffect(() => {
    const cameraStream = streams.find(stream => stream.type === STREAM_CAMERA);
    // const screenShareStream = streams.find(stream => stream.type === STREAM_SCREEN_SHARE);

    if (cameraStream) {
      const audio = cameraStream.getActiveAudioTrack();
      const video = cameraStream.getActiveVideoTrack();

      cameraStream.events.on('track-update', (track, { kind }) => {
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
    }
  }, [streams]);

  const handleTrackClick = useCallback(kind => () => {
    const track = tracksStatus[kind];
    (kind === 'audio' ? onAudioChange : onVideoChange)(track.getStream())(!track.enabled);
  }, [tracksStatus]);

  return (
    <div className={classes.root}>
      {Object.entries(tracksStatus).map(([key, { enabled, muted, label }]) => {
        const Icon = (enabled && !muted)
          ? trackIcons[key].icon
          : trackIcons[key].offIcon;

        const tooltip = (enabled && !muted)
          ? `Using ${label}`
          : muted ? 'Muted' : 'Disabled';

        return (
          <Tooltip title={tooltip} key={key}>
            <IconButton aria-label={key} onClick={handleTrackClick(key)}>
              <Icon
                fontSize="large"
                color="inherit"
                className={classnames(
                  classes.icon,
                  {
                    [classes.iconMuted]: muted,
                    [classes.iconDisabled]: !enabled
                  }
                )}
              />
            </IconButton>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default StreamIndicator;
