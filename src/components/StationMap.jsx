import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { fetchStations, fetchStationStatus } from '../actions';

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoidW1vIiwiYSI6ImNqNjU0bTNoNjF5NDczM3A4eHFuMTBiMXgifQ.LJoaUT85C0dkAZDNYjhRYQ',
});

const propTypes = {
  fetchStations: PropTypes.func.isRequired,
  fetchStationStatus: PropTypes.func.isRequired,
  stations: PropTypes.shape({
    station_status: PropTypes.array,
    stations: PropTypes.array,
  }),
};

const defaultProps = {
  stations: [{}],
};

class StationMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: [-74.0059, 40.7128],
      zoom: [11],
      station: null,
      style: 'mapbox://styles/mapbox/streets-v9',
    };
  }

  componentWillMount() {
    this.props.fetchStations();
    this.props.fetchStationStatus();
  }

  getStationStatus(activeStation) {
    return _.find(
      this.props.stations.station_status,
      (station) => {
        return station.station_id === activeStation.station_id;
      }
    );
  }

  stationClick = (station) => {
    const status = this.getStationStatus(station);

    this.setState({
      center: [station.lon, station.lat],
      zoom: [14],
      station: {
        id: station.station_id,
        name: station.name,
        lat: station.lat,
        lon: station.lon,
        bikes_available: status.num_bikes_available,
        docks_available: status.num_docks_available,
      },
    });
  }

  renderStations() {
    return _.map(this.props.stations.stations, station => (
      <Feature
        key={station.station_id}
        coordinates={[station.lon, station.lat]}
        onClick={this.stationClick.bind(this, station)}
      />
    ));
  }

  render() {
    return (
      <Map
        style={this.state.style}
        center={this.state.center}
        zoom={this.state.zoom}
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
      >
        <Layer
          type="symbol"
          id="station"
          layout={{ 'icon-image': 'bicycle-share-15' }}
        >
          {this.renderStations()}
        </Layer>
        {
          this.state.station != null && (
            <Popup
              key={this.state.station.station_id}
              offset={[0, -50]}
              coordinates={[this.state.station.lon, this.state.station.lat]}
            >
              <div>{this.state.station.name}</div>
              <div>Bikes: {this.state.station.bikes_available}</div>
              <div>Docks: {this.state.station.docks_available}</div>
            </Popup>
          )
        }
      </Map>
    );
  }
}

StationMap.propTypes = propTypes;
StationMap.defaultProps = defaultProps;

function mapStateToProps({ stations }) {
  return { stations };
}

export default connect(mapStateToProps, { fetchStations, fetchStationStatus })(StationMap);
