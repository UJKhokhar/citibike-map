import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { HashRouter, Switch, Route } from 'react-router-dom';

import LoadableStationMap from './loadables/LoadableStationMap';
import LoadableTripMap from './loadables/LoadableTripMap';
import Nav from './components/Nav';
import reducers from './reducers';

const store = createStore(
  reducers,
  applyMiddleware(thunk),
);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <HashRouter>
        <div>
          <Nav />
          <Switch>
            <Route path="/" exact component={LoadableStationMap} />
            <Route path="/trips" exact component={LoadableTripMap} />
          </Switch>
        </div>
      </HashRouter>
    </div>
  </Provider>,
  document.querySelector('.container'),
);
