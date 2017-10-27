import _ from 'lodash';
import { FETCH_TRIPS } from '../actions';

export default function (state = {}, action) {
  switch (action.type) {
    case FETCH_TRIPS: {
      if (!_.isEmpty(action.payload)) {
        const newState = {};

        _.forEach(action.payload, function(data) {
          Object.assign(newState, state, {
            [data.trip._id]: data
          });
        });

        return newState;
      }

      return state;
    }
    default: {
      return state;
    }
  }
}
