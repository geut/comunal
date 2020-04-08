import React from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import Home from './Home';
import Record from './Record';
import Watch from './Watch';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/record" component={Record} />
        <Route exact path="/watch/:key" component={Watch} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
