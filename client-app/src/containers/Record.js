import React from 'react';
import hypercore from 'hypercore';
import randomAccessIdb from 'random-access-idb';
import mediaRecorderStream from 'media-recorder-stream';
import pump from 'pump';
import getMedia from 'getusermedia';
import pify from 'pify';
import swarm from '@geut/discovery-swarm-webrtc';
import { Buffer } from 'buffer';

const MIME = 'video/webm;codecs=vp9,opus';
const BOOTSTRAP_URL = 'http://localhost:4000';

class Record extends React.Component {
  state = {
    key: undefined,
    recorder: undefined
  }

  handleStart = () => {
    const video = document.getElementById('record-video');
    // const video2 = document.getElementById('record-video2');

    const feed = hypercore(randomAccessIdb(`record-${Date.now()}`));

    feed.ready(() => {
      (async () => {
        const sw = swarm({
          bootstrap: [BOOTSTRAP_URL],
          stream: () => {
            return feed.replicate(true, { live: true, encrypt: false });
          }
        });

        sw.on('error', console.error);

        sw.on('connection', peer => {
          console.log('connection');
        });

        sw.join(Buffer.from(feed.key.toString('hex')));

        const media = await pify(getMedia)({ video: true, audio: true });

        const videoBitsPerSecond = 800000;
        const audioBitsPerSecond = 128000;

        const opts = {
          mimeType: MIME,
          interval: 500,
          videoBitsPerSecond,
          audioBitsPerSecond
        };

        const recorder = mediaRecorderStream(media, opts);

        pump(recorder, feed.createWriteStream(), (err) => {
          if (err) console.log('err: ', err);
          feed.close();
        });

        video.srcObject = media;

        this.setState({ recorder, key: feed.key.toString('hex') });
      })();
    });
  }

  handleStop = () => {
    const { recorder } = this.state;
    recorder.stop();
  }

  render() {
    const { key } = this.state;

    return (
      <div>
        <pre>{key}</pre><br />
        <video id="record-video" autoPlay /><br />
        {/* <video id="record-video2" /><br /> */}
        <button onClick={this.handleStart}>Start</button>
        <button onClick={this.handleStop}>Stop</button>
      </div>
    );
  }
}

export default Record;
