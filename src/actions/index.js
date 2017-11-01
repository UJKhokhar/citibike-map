import axios from 'axios';

export const FETCH_STATIONS = 'FETCH_STATIONS';
export const FETCH_STATION_STATUS = 'FETCH_STATIONS_STATUS';

export function fetchStations() {
  const request = axios.get(
    'https://gbfs.citibikenyc.com/gbfs/en/station_information.json',
  );

  return (dispatch) => {
    request.then(({ data }) => {
      dispatch({ type: FETCH_STATIONS, payload: data });
    });
  };
}

export function fetchStationStatus() {
  const request = axios.get(
    'https://gbfs.citibikenyc.com/gbfs/en/station_status.json',
  );

  return (dispatch) => {
    request.then(({ data }) => {
      dispatch({ type: FETCH_STATION_STATUS, payload: data });
    });
  };
}

export const FETCH_TRIPS = 'FETCH_TRIPS';

export function fetchTrips(dateAndTime) {
  const tripsURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3030/trips' : 'https://boiling-everglades-19027.herokuapp.com/trips';

  const request = axios.post(
    tripsURL,
    { dateAndTime },
  );

  return (dispatch) => {
    request.then(({ data }) => {
      dispatch({ type: FETCH_TRIPS, payload: data });
    });
  };
}
