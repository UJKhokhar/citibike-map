import { combineReducers } from 'redux';
import StationsReducer from './reducer_stations';
import TripsReducer from './reducer_trips';
import ErrorsReducer from './reducer_errors';

const rootReducer = combineReducers({
  stations: StationsReducer,
  trips: TripsReducer,
  errors: ErrorsReducer,
});

export default rootReducer;
