import React, {Component} from 'react';
import MapGL, {Marker} from 'react-map-gl';
import {connect} from 'react-redux';
import {fetchStations} from '../actions';
import _ from 'lodash';

import Pin from './pin';

class Map extends Component {

  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        latitude: 40.738900,
        longitude: -73.995051,
        zoom: 10.5,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500
      }
    }
  }

  componentDidMount() {
    this.props.fetchStations();
  }

  _updateViewport = (viewport) => {
    this.setState({viewport});
  }

  renderStations() {
    // console.log(this.props.stations);
    // const stations = _.chunk(this.props.stations.stations, 10);
    // const first_group = stations[0];
    //
    // console.log(first_group);

    return _.map(this.props.stations.stations, station => {
      return (
        <Marker
          key={station.station_id}
          latitude={station.lat}
          longitude={station.lon}>
          <Pin />
        </Marker>
      )
    });
  }

  render() {
      const {viewport} = this.state;

      return (
        <MapGL
          {...viewport}
          onViewportChange={this._updateViewport}
          mapStyle="mapbox://styles/mapbox/basic-v8">
          {this.renderStations()}
        </MapGL>
      );
    }
}

function mapStateToProps({stations}) {
  return {stations};
}

export default connect(mapStateToProps, {fetchStations})(Map);
