import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import Home from './Home';

import Layout from '../components/Layout';
import Meeting from './Meeting';

class App extends React.Component {
  render() {
    return (
      <Layout>
        <Router>
          <Switch>
            <Route path="/:meetingId">
              <Meeting />
            </Route>
            <Route path="/">
              <Home />
            </Route>
            <Redirect to="/" />
          </Switch>
        </Router>
      </Layout>
    );
  }
}

export default App;
