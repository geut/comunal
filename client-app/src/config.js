
const localOrDefault = (key, defaultValue) => {
  const value = localStorage.getItem(key);
  return (value !== null) ? JSON.parse(value) : defaultValue;
};

export const SIGNAL_URL = localOrDefault('signal.url', process.env.SIGNAL_URL);
export const USER_VIDEO_ENABLED = localOrDefault('user.video.enabled', process.env.USER_VIDEO_ENABLED);
export const USER_AUDIO_ENABLED = localOrDefault('user.audio.enabled', process.env.USER_AUDIO_ENABLED);

export const setLocalConfig = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
