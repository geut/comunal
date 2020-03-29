import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import './index.css'
import Layout from './components/layout/layout'
import Main from './components/main/main'
import About from './components/about/about'

const Container = ({ children }) => (
  <Router>
    <Layout>{children}</Layout>
  </Router>
)

const App = () => {
  // const [loading, setLoading] = useState(true)

  /*
  useEffect(() => {
    ;(async () => {
      const profiles = await p2p.listProfiles()
      const profile = profiles.find(profile => profile.metadata.isWritable)
      if (profile) setProfile(profile)
      setLoading(false)
    })()
  }, [])

  if (loading) return <Container />
  */

  return (
    <Container>
      <Switch>
        <Route path='/' exact>
          <Main />
        </Route>
        <Route path='/about'>
          <About />
        </Route>
      </Switch>
    </Container>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
