import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();

  const handleRecord = useCallback(() => {
    history.push('/record');
  });

  return (
    <div>
      <button onClick={handleRecord}>Record</button>
    </div>
  );
};

export default Home;
