import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LoadableStationMap from './loadables/LoadableStationMap';
import LoadableTripMap from './loadables/LoadableTripMap';
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
            <Route path="/" exact component={LoadableStationMap} />
            <Route path="/trips" exact component={LoadableTripMap} />
          </Switch>
        </div>
      </Router>
    </div>
  </Provider>,
  document.querySelector('.container'),
);
