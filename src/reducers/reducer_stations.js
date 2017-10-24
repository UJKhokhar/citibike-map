import { FETCH_STATIONS, FETCH_STATION_STATUS } from '../actions';

export default function (state = {}, action) {
  switch (action.type) {
    case FETCH_STATIONS: {
      return { ...state, stations: action.payload.data.stations };
    }
    case FETCH_STATION_STATUS: {
      return { ...state, station_status: action.payload.data.stations };
    }
    default:
      return state;
  }
}
