import React from 'react';
import hypercore from 'hypercore';
import randomAccessIdb from 'random-access-idb';
import pify from 'pify';
import pEvent from 'p-event';
import swarm from '@geut/discovery-swarm-webrtc';
import { Buffer } from 'buffer';

const MIME = 'video/webm;codecs=vp9,opus';
const BOOTSTRAP_URL = 'http://localhost:4000';

class Watch extends React.Component {
  state = {
    key: undefined,
    feed: undefined
  }

  componentDidMount() {
    const { feedKey: key } = this.props;

    const feed = hypercore(randomAccessIdb(`watch-${Date.now()}`), key);

    feed.ready(() => {
      (async () => {
        const sw = swarm({
          bootstrap: [BOOTSTRAP_URL],
          stream: () => {
            return feed.replicate(false, { live: true, encrypt: false });
          }
        });

        sw.on('error', console.error);

        sw.on('connection', peer => {
          console.log('connection', peer);
        });

        sw.join(Buffer.from(key));

        // await pEvent(feed, 'sync');

        this.setState({ feed });
      })();

    });
  }

  startWatch = () => {
    const { feed } = this.state;

    // const feedGet = pify(feed.get).bind(feed);
    // const feedGetBatch = pify(feed.getBatch).bind(feed);

    const video = document.getElementById('watch-video');

    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);
    video.addEventListener('error', console.log);

    (async () => {
      await pEvent(mediaSource, 'sourceopen');

      const sourceBuffer = mediaSource.addSourceBuffer(MIME);
      sourceBuffer.mode = 'sequence';

      let appended = 0;
      let buffers = [];
      const handleUpdateEnd = () => {
        if (
          mediaSource.readyState === "open" &&
          sourceBuffer &&
          sourceBuffer.updating === false
        ) {
          try {
            // Initialization
            if (appended < 6) {
              feed.get(appended, (err, buffer) => {
                console.log(buffer);
                sourceBuffer.appendBuffer(buffer);
              });
              appended++;
            } else if (buffers.length > 0) {
              sourceBuffer.appendBuffer(buffers.shift());
            } else {
              console.log('timeout')
              setTimeout(handleUpdateEnd, 500);
            }
          } catch (err) {
            console.log(err);
          }
        }

        // Limit the total buffer size to 20 minutes
        // This way we don't run out of RAM
        if (
          video.buffered.length &&
          video.buffered.end(0) - video.buffered.start(0) > 1200
        ) {
          sourceBuffer.remove(0, video.buffered.end(0) - 1200)
        }
      }

      feed.createReadStream({ live: true, tail: true }).on('data', data => {
        buffers.push(data);
      });

      sourceBuffer.addEventListener('updateend', handleUpdateEnd);


      feed.update(6, () => {
        console.log(feed.length);
        handleUpdateEnd();
      })
    })();
  }

  render() {
    const { key } = this.props;
    const { feed } = this.state;

    return (
      <div>
        <pre>{key}</pre><br />
        {feed && <button onClick={this.startWatch}>Start watching</button>}
        <video id="watch-video" autoPlay /><br />
      </div>
    );
  }
};

export default Watch;
