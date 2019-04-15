import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import React from 'react'
import { hot } from 'react-hot-loader'

import App from '@fe/src/App'
import AddBookmark from '@fe/src/views/add-bookmark'

const router = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App}></Route>
      <Route path="/add-bookmark" component={AddBookmark}></Route>
    </Switch>
  </Router>
)

/* eslint-disable */
export default hot(module)(router)
