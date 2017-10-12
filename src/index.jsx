import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// import StationMap from './components/StationMap';
import TripMap from './components/TripMap';
import reducers from './reducers';

const store = createStore(
  reducers,
  applyMiddleware(thunk),
);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <TripMap />
    </div>
  </Provider>,
  document.querySelector('.container'),
);
