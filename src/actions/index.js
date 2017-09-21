import axios from 'axios';

export const FETCH_STATIONS = 'FETCH_STATIONS';
export const FETCH_STATION_STATUS = 'FETCH_STATIONS_STATUS';

export function fetchStations() {
  const request = axios.get(`https://gbfs.citibikenyc.com/gbfs/en/station_information.json`);

  return {
    type: FETCH_STATIONS,
    payload: request
  }
}

export function fetchStationStatus(){
  const request = axios.get(`https://gbfs.citibikenyc.com/gbfs/en/station_status.json`);

  return {
    type: FETCH_STATION_STATUS,
    payload: request
  }
}

export const FETCH_ROUTE = 'FETCH_ROUTE';

const baseURL = 'https://api.mapbox.com/directions/v5/mapbox/cycling';
const accessToken = 'pk.eyJ1IjoidW1vIiwiYSI6ImNqNjU0bTNoNjF5NDczM3A4eHFuMTBiMXgifQ.LJoaUT85C0dkAZDNYjhRYQ';

export function fetchTripRoute(trip) {
  const request = axios.get(
    `${baseURL}/${trip.start_station.lng},${trip.start_station.lat};${trip.end_station.lng},${trip.end_station.lat}?access_token=${accessToken}&geometries=geojson`
  );

  return {
    type: FETCH_ROUTE,
    payload: request,
    meta: {
      start_time: trip.start_time,
      stop_time: trip.stop_time
    }
  }
};
