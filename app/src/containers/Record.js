import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import mediaRecorderStream from 'media-recorder-stream';
import pump from 'pump';
import webmClusterStream from 'webm-cluster-stream';
import getMedia from 'getusermedia';
import hypercore from 'hypercore';
import storage from 'random-access-chrome-file';

const Record = () => {
  const videoRef = React.createRef();

  const [feed, setFeed] = useState();
  const [recorder, setRecorder] = useState();

  useEffect(() => {
    const feed = hypercore(storage);

    feed.on('ready', function () {
      setFeed(feed);
    });
  }, []);

  useEffect(() => {
    if (!recorder) return;
    return () => recorder.stop();
  }, [recorder]);

  const stopRecording = useCallback(() => {
    recorder.stop();
  }, [recorder]);

  useEffect(() => {
    if (!feed) return;

    (async () => {
      getMedia({ video: true, audio: false }, function (err, media) {
        if (err) throw err;

        const video = 800000;
        const audio = 128000;

        const opts = {
          mimeType: 'video/webm;codecs=vp9,opus',
          interval: 1000,
          videoBitsPerSecond: video,
          audioBitsPerSecond: audio
        };

        const mediaRecorder = mediaRecorderStream(media, opts);

        const stream = pump(mediaRecorder, webmClusterStream(), function (err) {
          if (err) console.log('err: ', err);
          console.log('closed');
          feed.close(function (err) { if (err) console.log('err: ', err); });
        });

        // append any new video to feed
        stream.on('data', function (data) {
          console.log(data.length, Math.floor(data.length / 16 / 1024), Math.floor(data.length / 10));
          feed.append(data);
        });

        videoRef.current.srcObject = media;
        videoRef.current.autoplay = true;

        setRecorder(mediaRecorder);
      });
    })();
  }, [feed, setRecorder]);

  if (!feed) return null;

  console.log(feed);

  return (
    <div>
      <video ref={videoRef} /><br />
      <button onClick={stopRecording} >Stop recording</button><br />
      <Link to={`/watch/${feed.key.toString('hex')}`}>WATCH</Link>
    </div>
  );
};

export default Record;
