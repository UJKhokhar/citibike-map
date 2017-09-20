import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';

import Map from './components/map2';
import TripMap from './components/trip_map';
import TimeSlider from './components/timeslider';
import Test from './components/memoize_test';

import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <div>
      <Test />
    </div>
  </Provider>
  , document.querySelector('.container')
);
