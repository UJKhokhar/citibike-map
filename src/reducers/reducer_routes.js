import { FETCH_ROUTE } from '../actions';

export default function (state = {}, action) {
  switch (action.type) {
    case FETCH_ROUTE: {
      const routes = action.payload.data;
      return { ...state,
        [routes.uuid]: {
          coords: routes.routes[0].geometry.coordinates,
          trip: action.meta.trip,
        },
      };
    }
    default: {
      return state;
    }
  }
}
