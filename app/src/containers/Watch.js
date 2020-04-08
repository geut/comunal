import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import hypercore from 'hypercore';
import storage from 'random-access-chrome-file';
import pify from 'pify';

const videoRef = React.createRef();

const Watch = () => {
  const { key } = useParams();

  useEffect(() => {
    const feed = hypercore(storage, key, {
      sparse: true
    });

    feed.on('ready', () => {
      const mediaSource = new MediaSource();

      videoRef.current.src = window.URL.createObjectURL(mediaSource);

      mediaSource.addEventListener('sourceopen', function () {
        const sourceBuffer = this.addSourceBuffer('video/webm;codecs=vp9,opus');
        sourceBuffer.mode = 'sequence';

        read(sourceBuffer);
      });

      async function read(sourceBuffer) {
        const blocks = feed.length;
        console.log(blocks);
        let block = 0;

        let buffer;

        sourceBuffer.addEventListener('updateend', () => {
          setTimeout(function () {
            if (block === 0 && blocks > 6) {
              block = blocks - 5;
            } else {
              if (buffer) block++;
            }

            loop();
          }, 2000);
        }, false);

        async function loop() {
          try {
            buffer = await pify(feed.get).bind(feed)(block);
          } catch (err) {
            console.log(`error downloading block ${block}`, err);
          }

          if (buffer) {
            console.log(`appending block ${block}`);
            sourceBuffer.appendBuffer(buffer);
          }
        }

        loop();
      };
    });
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay controls crossOrigin="anonymous" preload="auto" /><br />
    </div>
  );
};

export default Watch;
