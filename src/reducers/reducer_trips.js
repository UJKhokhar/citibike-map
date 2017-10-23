import _ from 'lodash';
import { FETCH_TRIPS } from '../actions';

export default function (state = {}, action) {
  switch (action.type) {
    case FETCH_TRIPS: {
      if (!_.isEmpty(action.payload)) {
        let newState = {};
        console.log('payload', action.payload);

        _.forEach(action.payload, function(data) {
          Object.assign(newState, state, {
            [data.trip._id]: data
          });
        });

        return newState;
      } else {
        return state;
      }
      console.log(action.payload);



      return newState;
    }
    default: {
      return state;
    }
  }
}
