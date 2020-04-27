import { useState, useEffect } from 'react';

import { createSwarm } from '../lib/swarm';

export const useConnection = channel => {
  const [swarm, setSwarm] = useState(null);
  const [peers, setPeers] = useState({});

  useEffect(() => {
    const swarm = createSwarm(channel);

    const handlePeerUpdated = peer => {
      setPeers(peers => ({
        ...peers,
        [peer.id]: peer
      }));
    };

    const handlePeerDisconnected = peer => {
      setPeers(peers => ({
        ...peers,
        [peer.id]: undefined
      }));
    };

    swarm.on('peer-connected', handlePeerUpdated);
    swarm.on('peer-disconnected', handlePeerDisconnected);
    swarm.on('peer-stream', handlePeerUpdated);

    setSwarm(swarm);

    return () => {
      swarm.removeListener('peer-connected', handlePeerUpdated);
      swarm.removeListener('peer-disconnected', handlePeerDisconnected);
      swarm.removeListener('peer-stream', handlePeerUpdated);
      swarm.leave();
    };
  }, []);

  return { swarm, peers };
};
