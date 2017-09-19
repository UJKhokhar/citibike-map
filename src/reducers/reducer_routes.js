import {FETCH_ROUTE} from '../actions';

export default function(state = {}, action) {
  switch(action.type) {
    case FETCH_ROUTE:
      const routes = action.payload.data;
      return { ...state, [routes.uuid]: routes.routes[0].geometry.coordinates };
    default:
      return state;
  }
}
