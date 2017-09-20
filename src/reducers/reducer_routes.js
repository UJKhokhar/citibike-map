import {FETCH_ROUTE} from '../actions';

export default function(state = {}, action) {
  switch(action.type) {
    case FETCH_ROUTE:
      const routes = action.payload.data;
      return { ...state, [routes.uuid]: routes.routes[0].geometry.coordinates };
    case 'TEST_MEMOIZE':
      console.log('WE IN THE DISPATCHER');
    default:
      return state;
  }
}
