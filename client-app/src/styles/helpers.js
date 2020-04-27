import { makeStyles } from '@material-ui/core';

export const notVisible = {
  visibility: 'hidden',
  opacity: 0,
  transition: 'visibility 0s, opacity 0.25s linear'
};

export const visible = {
  visibility: 'visible',
  opacity: 1
};

export const useVisibleStyles = makeStyles(() => ({
  visible,
  notVisible
}));

export const useBoxShadowStyles = makeStyles(() => ({
  boxShadow: {
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 5px 8px 0px, rgba(0, 0, 0, 0.12) 0px 1px 14px 0px'
  }
}));
