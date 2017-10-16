import axios from 'axios';

export const FETCH_STATIONS = 'FETCH_STATIONS';
export const FETCH_STATION_STATUS = 'FETCH_STATIONS_STATUS';

export function fetchStations() {
  const request = axios.get(
    'https://gbfs.citibikenyc.com/gbfs/en/station_information.json',
  );

  return {
    type: FETCH_STATIONS,
    payload: request,
  };
}

export function fetchStationStatus() {
  const request = axios.get(
    'https://gbfs.citibikenyc.com/gbfs/en/station_status.json',
  );

  return {
    type: FETCH_STATION_STATUS,
    payload: request,
  };
}

export const FETCH_TRIPS = 'FETCH_TRIPS';

export function fetchTrips(date, time) {
  console.log('sup');
  const request = axios.post(
    'http://localhost:3030/trips',
    { date, time },
  );

  return {
    type: FETCH_TRIPS,
    payload: request,
  };
}

export const FETCH_ROUTE = 'FETCH_ROUTE';

const baseURL = 'https://api.mapbox.com/directions/v5/mapbox/cycling';
const accessToken = process.env.MAPBOX_API_KEY;
const fakeToken = 'faketoken';

export function fetchTripRoute(trip) {
  const request = axios.get(
    `${baseURL}/${trip['start station longitude']},${trip['start station latitude']};${trip['end station longitude']},${trip['end station latitude']}?access_token=${fakeToken}&geometries=geojson`,
  );

  return (dispatch) => {
    request.then(({ data }) => {
      dispatch({ type: FETCH_ROUTE, payload: data, meta: { trip } });
    }).catch((error) => {
      dispatch({ type: error.response.status.toString(), payload: error.response });
    });
  };
}
