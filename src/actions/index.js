import axios from 'axios';

export const FETCH_STATIONS = 'FETCH_STATIONS';
export const FETCH_STATION_STATUS = 'FETCH_STATIONS_STATUS';

export function fetchStations() {
  const request = axios.get('https://gbfs.citibikenyc.com/gbfs/en/station_information.json');

  return {
    type: FETCH_STATIONS,
    payload: request,
  };
}

export function fetchStationStatus() {
  const request = axios.get('https://gbfs.citibikenyc.com/gbfs/en/station_status.json');

  return {
    type: FETCH_STATION_STATUS,
    payload: request,
  };
}

export const FETCH_ROUTE = 'FETCH_ROUTE';

const baseURL = 'https://api.mapbox.com/directions/v5/mapbox/cycling';
const accessToken = 'pk.eyJ1IjoidW1vIiwiYSI6ImNqNjU0bTNoNjF5NDczM3A4eHFuMTBiMXgifQ.LJoaUT85C0dkAZDNYjhRYQ';

export function fetchTripRoute(trip) {
  const request = axios.get(
    `${baseURL}/${trip['start station longitude']},${trip['start station latitude']};${trip['end station longitude']},${trip['end station latitude']}?access_token=${accessToken}&geometries=geojson`,
  );

  return {
    type: FETCH_ROUTE,
    payload: request,
    meta: { trip },
  };
}
