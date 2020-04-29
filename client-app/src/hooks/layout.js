import { useEffect, useState } from 'react';

export const useWindowSize = () => {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};

export const useParentDimensions = ({ parentElement }) => {
  const style = window.getComputedStyle(parentElement, null);
  const padding = parseFloat(style.getPropertyValue('padding'));

  return {
    width: parseFloat(style.getPropertyValue('width')) - (padding * 2),
    height: parseFloat(style.getPropertyValue('height')) - (padding * 2)
  };
};
