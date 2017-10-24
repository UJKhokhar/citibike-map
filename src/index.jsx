import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import StationMap from './components/StationMap';
import TripMap from './components/TripMap';
import Nav from './components/Nav';
import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers, composeEnhancers(
    applyMiddleware(thunk),
  ));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router>
        <div>
          <Nav />
          <Switch>
            <Route path="/" exact component={StationMap} />
            <Route path="/trips" exact component={TripMap} />
          </Switch>
        </div>
      </Router>
    </div>
  </Provider>,
  document.querySelector('.container'),
);
