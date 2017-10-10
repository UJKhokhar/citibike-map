import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';
import PropTypes from 'prop-types';
import { fetchTripRoute } from '../actions';
import convertTimeToMinutes from '../utilities/convert_time';
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
      trip: null,
    };

    // Memoize so that we don't make the same request twice
    this.memoized = memoize(
      this.props.fetchTripRoute,
      {
        primitive: true,
        normalizer: args => JSON.stringify(args[0]),
      },
    );

    this.hidePopup = this.hidePopup.bind(this);
  }

  handleClick = (trip) => {
    this.setState({ trip });
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
      trip: null,
    });
  }

  hidePopup() {
    this.setState({ trip: null });
  }

  renderPaths() {
    const activeTrips = _.filter(this.props.routes, trip => (
      convertTimeToMinutes(trip.trip.starttime) <= this.state.time &&
      convertTimeToMinutes(trip.trip.stoptime) >= this.state.time
    ));

    const paths = _.map(activeTrips, trip => (
      <Feature
        key={trip.trip.bikeid}
        coordinates={trip.coords}
        onClick={this.handleClick.bind(this, trip)}
      />
    ));

    return paths;
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
          onClick={this.hidePopup}
        >
          {
            !_.isEmpty(this.props.routes) && (
              <div>
                <Layer
                  type="line"
                  paint={{
                    'line-width': 6,
                  }}
                >
                  {this.renderPaths()}
                </Layer>
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
                {
                  this.state.trip != null && (
                    <Popup
                      key={this.state.trip.starttime}
                      offset={[0, -50]}
                      coordinates={this.state.trip.coords[0]}
                    >
                      <div>Bike ID: {this.state.trip.trip.bikeid}</div>
                      <div>Start Station: {this.state.trip.trip['start station name']}</div>
                      <div>End Station: {this.state.trip.trip['end station name']}</div>
                      <div>Trip Duration: {this.state.trip.trip.tripduration}</div>
                    </Popup>
                  )
                }
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
