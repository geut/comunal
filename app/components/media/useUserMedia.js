import React, { useState, useEffect } from 'react'

export function useUserMedia (opts = {}) {
  const [mediaStream, setMediaStream] = useState(null);

  const requestedMedia = { video: true, ...opts.access }

  useEffect(() => {
    async function enableStream () {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(requestedMedia)
        setMediaStream(stream)
      } catch (err) {
        console.error('Access to camera resources DENIED')
      }
    }

    if (!mediaStream) {
      enableStream()
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    }

  }, [mediaStream, requestedMedia])

  return mediaStream
}
