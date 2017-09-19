import {combineReducers} from 'redux';
import StationsReducer from './reducer_stations';
import RoutesReducer from './reducer_routes';

const rootReducer = combineReducers({
  stations: StationsReducer,
  routes: RoutesReducer
});

export default rootReducer;
