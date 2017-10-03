import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature } from 'react-mapbox-gl';
import PropTypes from 'prop-types';
import { fetchTripRoute } from '../actions';
import { convertTimeToMinutes } from '../utilities/convert_time';
import json from '../../tripdata.json';
import TimeSlider from '../components/TimeSlider';

const memoize = require('memoizee');

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_API_KEY,
});

const propTypes = {
  fetchTripRoute: PropTypes.func.isRequired,
  routes: PropTypes.shape({
    coords: PropTypes.object,
    trip: PropTypes.object,
  }),
};

const defaultProps = {
  routes: {},
};

class TripMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      center: [-74.0059, 40.7128],
      zoom: [11],
      style: 'mapbox://styles/mapbox/streets-v9',
    };

    // Memoize so that we don't make the same request twice
    this.memoized = memoize(
      this.props.fetchTripRoute,
      {
        primitive: true,
        normalizer: args => JSON.stringify(args[0]),
      },
    );
  }

  fetchRoutes() {
    const trips = _.filter(json, o => (
      convertTimeToMinutes(o.starttime) <= this.state.time &&
      convertTimeToMinutes(o.stoptime) >= this.state.time
    ));

    let i;
    for (i = 0; i < trips.length; i += 1) {
      this.memoized(trips[i]);
    }
  }

  handleChange = (value) => {
    this.fetchRoutes();
    this.setState({
      time: value,
    });
  }

  renderPaths() {
    const activeTrips = _.filter(this.props.routes, trip => (
      convertTimeToMinutes(trip.trip.starttime) <= this.state.time &&
      convertTimeToMinutes(trip.trip.stoptime) >= this.state.time
    ));

    const geoArray = _.map(activeTrips, (trip) => {
      const obj = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: trip.coords,
        },
      };
      return obj;
    });

    return geoArray;
  }

  renderStartStations() {
    const activeTrips = _.filter(this.props.routes, trip => (
      convertTimeToMinutes(trip.trip.starttime) <= this.state.time &&
      convertTimeToMinutes(trip.trip.stoptime) >= this.state.time
    ));

    return _.map(activeTrips, trip => (
      <Feature
        key={trip.trip['start station id']}
        coordinates={[
          trip.trip['start station longitude'],
          trip.trip['start station latitude'],
        ]}
      />
    ));
  }

  renderEndStations() {
    const activeTrips = _.filter(this.props.routes, trip => (
      convertTimeToMinutes(trip.trip.starttime) <= this.state.time &&
      convertTimeToMinutes(trip.trip.stoptime) >= this.state.time
    ));

    return _.map(activeTrips, trip => (
      <Feature
        key={trip.trip['end station id']}
        coordinates={[trip.trip['end station longitude'], trip.trip['end station latitude']]}
      />
    ));
  }

  render() {
    return (
      <div>
        <Map
          style={this.state.style}
          center={this.state.center}
          zoom={this.state.zoom}
          containerStyle={{
            height: '100vh',
            width: '100vw',
          }}
        >
          {
            !_.isEmpty(this.props.routes) && (
              <div>
                <Layer
                  type="symbol"
                  id="startstation"
                  layout={{ 'icon-image': 'bicycle-share-15' }}
                >
                  {this.renderStartStations()}
                </Layer>
                <Layer
                  type="symbol"
                  id="endstation"
                  layout={{ 'icon-image': 'circle-15' }}
                >
                  {this.renderEndStations()}
                </Layer>
                <GeoJSONLayer
                  data={{
                    type: 'FeatureCollection',
                    features: this.renderPaths(),
                  }}
                  lineLayout={{
                    'line-cap': 'round',
                  }}
                  linePaint={{
                    'line-width': 6,
                    'line-color': '#FA3C00',
                  }}
                />
              </div>
            )
          }
        </Map>
        <TimeSlider value={this.state.time} onChange={this.handleChange} />
      </div>
    );
  }
}

TripMap.propTypes = propTypes;
TripMap.defaultProps = defaultProps;

function mapStateToProps({ routes }) {
  return { routes };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchTripRoute }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TripMap);
