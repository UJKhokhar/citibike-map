import { combineReducers } from 'redux';
import StationsReducer from './reducer_stations';
import RoutesReducer from './reducer_routes';
import ErrorsReducer from './reducer_errors';

const rootReducer = combineReducers({
  stations: StationsReducer,
  routes: RoutesReducer,
  errors: ErrorsReducer,
});

export default rootReducer;
