//
// Copyright 2020 Wireline, Inc.
//

import crypto from 'crypto';
import { EventEmitter } from 'events';
import discoverySwarmWebRTC from '@geut/discovery-swarm-webrtc';

import { SIGNAL_URL } from '../config';

import { enhanceStream } from './media';

const MESSAGE_TYPE_STREAM_INFO = 'stream.info';

class Swarm extends EventEmitter {
  _swarm = null;
  _peers = new Map();
  _streams = new Map(); // User streams
  _data = new Map();
  _bufferChannel = null;

  constructor(channel) {
    super();

    this._swarm = discoverySwarmWebRTC({
      bootstrap: [SIGNAL_URL]
    });

    this._bufferChannel = crypto.createHash('sha256')
      .update(channel)
      .digest();

    this._swarm.on('connection', this._handleConnection);
    this._swarm.on('connection-closed', this._handleConnectionClosed);

    this._swarm.join(this._bufferChannel);

    window.swarm = this;
  }

  get peers() {
    return this._peers;
  }

  get peersList() {
    return Array.from(this._peers.values());
  }

  get streams() {
    return this._streams;
  }

  get streamsList() {
    return Array.from(this._streams.values());
  }

  _handleConnection = peer => {
    this._peers.set(peer.id, {
      peer,
      streams: new Map()
    });

    peer.on('stream', this._handlePeerStream(peer.id));
    peer.on('data', this._handlePeerData(peer.id));

    this.shareStreams(peer.id);

    this.emit('peer-connected', this._peers.get(peer.id));
  }

  _handleConnectionClosed = (_, info) => {
    const peerId = info.id;
    const peer = this._peers.get(peerId);

    if (!peer) return;

    this._peers.delete(peerId);

    this.emit('peer-disconnected', peer);
  };

  _handlePeerStream = peerId => peerStream => {
    const stream = enhanceStream(peerStream, () => {
      const { streams } = this._peers.get(peerId);
      const { info } = streams.get(peerStream.id);
      return info;
    });

    const peer = this._peers.get(peerId);

    let peerStreamEntry = peer.streams.get(stream.id);

    if (!peerStreamEntry) {
      peer.streams.set(stream.id, {});
      peerStreamEntry = peer.streams.get(stream.id);
    }

    peerStreamEntry.stream = stream;

    peer.streams.set(stream.id, peerStreamEntry);

    this._peers.set(peerId, peer);

    this.emit('peer-stream', peer, stream);
  };

  _handlePeerData = peerId => peerData => {
    const { type, data } = JSON.parse(peerData.toString());

    console.log(type, data);

    if (type === MESSAGE_TYPE_STREAM_INFO) {
      const peer = this._peers.get(peerId);
      let peerStreamEntry = peer.streams.get(data.id);

      if (!peerStreamEntry) {
        peer.streams.set(data.id, {});
        peerStreamEntry = peer.streams.get(data.id);
      }

      peerStreamEntry.info = data.info;

      peer.streams.set(data.id, peerStreamEntry);

      this._peers.set(peerId, peer);
    }
  };

  leave = async () => {
    return this._swarm.leave(this._bufferChannel);
  }

  addStream = stream => {
    this._streams.set(stream.id, stream);
    this.shareStream(stream);
  }

  removeStream = stream => {
    this._streams.delete(stream.id);
    this.shareStream(stream, false);
  }

  shareStream = (stream, added = true, peers) => {
    const peersToShare = peers || this.peersList.map(({ peer }) => peer);

    for (const peer of peersToShare) {
      try {
        if (added) {
          peer.addStream(stream);
          peer.send(JSON.stringify({ type: MESSAGE_TYPE_STREAM_INFO, data: { id: stream.id, info: stream.getInfo() } }));
        } else {
          peer.removeStream(stream);
        }
      } catch (err) {
        if (err.code !== 'ERR_SENDER_ALREADY_ADDED') {
          throw err;
        }
      }
    }
  }

  shareStreams = peerId => {
    const { peer } = this._peers.get(peerId);
    for (const stream of this._streams.values()) {
      this.shareStream(stream, true, [peer]);
    }
  }
};

export const createSwarm = channel => new Swarm(channel);
