import {combineReducers} from 'redux';
import StationsReducer from './reducer_stations';

const rootReducer = combineReducers({
  stations: StationsReducer
});

export default rootReducer;
