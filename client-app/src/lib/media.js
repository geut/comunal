import { EventEmitter } from 'events';
import pify from 'pify';
import getusermedia from 'getusermedia';
import enumerateDevices from 'enumerate-devices';

export const STREAM_CAMERA = 'stream-camera';
export const STREAM_SCREEN_SHARE = 'stream-screen-share';

const VIDEO_CONSTRAINTS = {
  aspectRatio: 1.7777777778,
  frameRate: 30
};

const VIDEO_SD_CONSTRAINTS = {
  ...VIDEO_CONSTRAINTS,
  frameRate: {
    max: 30
  },
  width: {
    ideal: 640,
    max: 640
  },
  height: {
    ideal: 400,
    max: 400
  }
};

const VIDEO_HD_CONSTRAINTS = {
  ...VIDEO_CONSTRAINTS,
  width: 1920,
  height: 1080,
  frameRate: 60
};

window.VIDEO_HD_CONSTRAINTS = VIDEO_HD_CONSTRAINTS;
window.VIDEO_SD_CONSTRAINTS = VIDEO_SD_CONSTRAINTS;
window.enumerateDevices = enumerateDevices;

export const getUserMedia = async ({ audio = true, video = true, videoHD = false } = {}) => {
  const constraints = {
    audio,
    video,
    ...(!video ? undefined : ({ video: videoHD ? VIDEO_HD_CONSTRAINTS : VIDEO_SD_CONSTRAINTS }))
  };

  const stream = await pify(getusermedia)(constraints);

  stream.type = STREAM_CAMERA;
  return enhanceStream(stream);
};

export const getDisplayMedia = async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: true });
  stream.type = STREAM_SCREEN_SHARE;
  return enhanceStream(stream);
};

/**
 * @param {MediaStream} stream
 */
export const isDesktopShareStream = stream => {
  const videoTrack = (stream.getVideoTracks() || [])[0];
  if (!videoTrack) return false;
  return videoTrack.label.startsWith('screen:');
};

export const isCameraStream = stream => {
  return !isDesktopShareStream(stream);
};

export const isAudioTrackEnabled = stream => {
  return stream.getAudioTracks()[0].enabled;
};

export const isAudioTrackMuted = stream => {
  return stream.getAudioTracks()[0].muted;
};

export const isVideoTrackEnabled = stream => {
  return stream.getVideoTracks()[0].enabled;
};

/**
 *
 * @param {MediaStream} stream
 */
export const enhanceStream = (stream, getInfoCB) => {
  const registerTrackHandlers = (kind, tracks = []) => {
    tracks.map(track => {
      track.setEnabled = (enabled = true) => {
        track.enabled = enabled;
        stream.events.emit('track-update', track, { kind, type: 'enabled' });
      };

      track.onended = event => stream.events.emit('track-update', track, { kind, type: 'ended' });
      track.onmute = event => stream.events.emit('track-update', track, { kind, type: 'muted' });
      track.onunmute = event => stream.events.emit('track-update', track, { kind, type: 'muted' });
    });
  };

  stream.events = new EventEmitter();

  stream.events.on('track-added', event => {
    console.log('track added', event.track.getSettings());
    registerTrackHandlers(event.track.kind, [event.track]);
  });

  stream.onaddtrack = event => stream.events.emit('track-added', event);
  stream.onremovetrack = event => stream.events.emit('track-removed', event);

  registerTrackHandlers('audio', stream.getAudioTracks());
  registerTrackHandlers('video', stream.getVideoTracks());

  stream.getActiveAudioTrack = () => {
    // TODO: get from config
    return stream.getAudioTracks()[0];
  };

  stream.getActiveVideoTrack = () => {
    // TODO: get from config
    return stream.getVideoTracks()[0];
  };

  stream.getActiveTrack = (kind) => {
    return kind === 'audio' ? stream.getActiveAudioTrack() : stream.getActiveVideoTrack();
  };

  stream.applyVideoConstraints = async constraints => {
    const tracks = await stream.getVideoTracks();
    await Promise.all(tracks.map(track => track.applyConstraints(constraints)));
  };

  stream.applyAudioConstraints = async constraints => {
    const tracks = await stream.getAudioTracks();
    await Promise.all(tracks.map(track => track.applyConstraints(constraints)));
  };

  stream.getInfo = () => {
    if (getInfoCB) {
      return getInfoCB();
    }

    const audioTrack = stream.getActiveAudioTrack();
    const videoTrack = stream.getActiveVideoTrack();

    return {
      audio: audioTrack && {
        settings: audioTrack.getSettings(),
        constraints: audioTrack.getConstraints()
      },
      video: videoTrack && {
        settings: videoTrack.getSettings(),
        constraints: videoTrack.getConstraints()
      }
    };
  };

  return stream;
};
