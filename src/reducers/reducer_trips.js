import _ from 'lodash';
import { FETCH_TRIPS } from '../actions';

export default function (state = {}, action) {
  switch (action.type) {
    case FETCH_TRIPS: {
      let newState = {};

      _.forEach(action.payload, function(trip) {
        Object.assign(newState, state, {
          [trip._id]: trip
        });
      });

      return newState;
    }
    default: {
      return state;
    }
  }
}
