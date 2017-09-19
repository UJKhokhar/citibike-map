import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchStations, fetchStationStatus} from '../actions';
import ReactMapboxGl, { Layer, Feature, Popup } from "react-mapbox-gl";
import _ from 'lodash';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidW1vIiwiYSI6ImNqNjU0bTNoNjF5NDczM3A4eHFuMTBiMXgifQ.LJoaUT85C0dkAZDNYjhRYQ"
});

class Map2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: [-74.0059, 40.7128],
      zoom: [11],
      station: null
    }
  }

  componentWillMount() {
    this.props.fetchStations();
    this.props.fetchStationStatus();
  }

  stationClick = (station) => {
    var status = this.getStationStatus(station);

    this.setState({
      center: [station.lon, station.lat],
      zoom: [14],
      station: {
        id: station.station_id,
        name: station.name,
        lat: station.lat,
        lon: station.lon,
        bikes_available: status.num_bikes_available,
        docks_available: status.num_docks_available
      }
    })
  }

  renderStations() {
    return _.map(this.props.stations.stations, station => {
      return (
        <Feature
          key={station.station_id}
          coordinates={[station.lon, station.lat]}
          onClick={this.stationClick.bind(this, station)}/>
      )
    });
  }

  getStationStatus(activeStation) {
    return _.find(
      this.props.stations.station_status,
      (station) => {
        return station.station_id === activeStation.station_id;
      }
    );
  }

  render() {
    return (
      <Map
        accessToken="pk.eyJ1IjoidW1vIiwiYSI6ImNqNjU0bTNoNjF5NDczM3A4eHFuMTBiMXgifQ.LJoaUT85C0dkAZDNYjhRYQ"
        style="mapbox://styles/mapbox/streets-v9"
        center={this.state.center}
        zoom={this.state.zoom}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
          <Layer
            type="symbol"
            id="station"
            layout={{ "icon-image": "bicycle-share-15" }}>
            {this.renderStations()}
          </Layer>
          {
            this.state.station != null && (
              <Popup
                key={this.state.station.station_id}
                offset={[0, -50]}
                coordinates={[this.state.station.lon, this.state.station.lat]}>
                  <div>{this.state.station.name}</div>
                  <div>Bikes: {this.state.station.bikes_available}</div>
                  <div>Docks: {this.state.station.docks_available}</div>
              </Popup>
            )
          }
      </Map>
    )
  }
}

function mapStateToProps({stations}) {
  return {stations};
}

export default connect(mapStateToProps, {fetchStations, fetchStationStatus})(Map2);
