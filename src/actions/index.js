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
