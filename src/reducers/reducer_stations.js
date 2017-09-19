import { FETCH_STATIONS } from '../actions';
import { FETCH_STATION_STATUS } from '../actions';
import { TEST_ACTION } from '../actions';

export default function(state = {}, action) {
  switch(action.type) {
    case FETCH_STATIONS:
      const stations = action.payload.data;
      return { ...state, ["stations"]: stations.data.stations};
    case FETCH_STATION_STATUS:
      const stationStatus = action.payload.data;
      return { ...state, ["station_status"]: stationStatus.data.stations};
    default:
      return state;
  }
}
