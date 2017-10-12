import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';
import PropTypes from 'prop-types';
import moment from 'moment';

import { fetchTripRoute } from '../actions';
import json from '../../tripdata.json';
import TimeSlider from './TimeSlider';
import Calendar from './Calendar';
import convertMinutesToTime from '../utilities/convertMinutesToTime';
import '../../styles/errors.scss';

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
  errors: PropTypes.shape({
    error: PropTypes.string,
  }),
};

const defaultProps = {
  routes: {},
  errors: {},
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
      date: moment('2017-07-01'),
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
    this.changeDate = this.changeDate.bind(this);
  }

  handleClick = (trip) => {
    this.setState({ trip });
  }

  fetchRoutes() {
    const trips = _.filter(json, o => (
      moment(o.starttime).isSame(this.state.date.format('YYYY-MM-DD'), 'day') &&
      moment(o.starttime).isSameOrBefore(`${this.state.date.format('YYYY-MM-DD')} ${convertMinutesToTime(this.state.time)}:00`) &&
      moment(o.stoptime).isSameOrAfter(`${this.state.date.format('YYYY-MM-DD')} ${convertMinutesToTime(this.state.time)}:00`)
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

  changeDate(date) {
    this.setState({
      date,
    });
  }

  renderPaths() {
    const activeTrips = _.filter(this.props.routes, trip => (
      moment(trip.trip.starttime).isSame(this.state.date.format('YYYY-MM-DD'), 'day') &&
      moment(trip.trip.starttime).isSameOrBefore(`${this.state.date.format('YYYY-MM-DD')} ${convertMinutesToTime(this.state.time)}:00`) &&
      moment(trip.trip.stoptime).isSameOrAfter(`${this.state.date.format('YYYY-MM-DD')} ${convertMinutesToTime(this.state.time)}:00`)
    ));

    // fulldate = `${this.state.date} ${convertMinutesToTime(this.state.time)}:00`

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
      moment(trip.trip.starttime).isSame(this.state.date.format('YYYY-MM-DD'), 'day') &&
      moment(trip.trip.starttime).isSameOrBefore(`${this.state.date.format('YYYY-MM-DD')} ${convertMinutesToTime(this.state.time)}:00`) &&
      moment(trip.trip.stoptime).isSameOrAfter(`${this.state.date.format('YYYY-MM-DD')} ${convertMinutesToTime(this.state.time)}:00`)
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
      moment(trip.trip.starttime).isSame(this.state.date, 'day') &&
      moment(trip.trip.starttime).isSameOrBefore(`${this.state.date.format('YYYY-MM-DD')} ${convertMinutesToTime(this.state.time)}:00`) &&
      moment(trip.trip.stoptime).isSameOrAfter(`${this.state.date.format('YYYY-MM-DD')} ${convertMinutesToTime(this.state.time)}:00`)
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
        { !_.isEmpty(this.props.errors) && (
          <div className="error">{this.props.errors.error}</div>
        )}
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
        <Calendar
          selected={this.state.date}
          onChange={this.changeDate}
        />
      </div>
    );
  }
}

TripMap.propTypes = propTypes;
TripMap.defaultProps = defaultProps;

function mapStateToProps({ routes, errors }) {
  return { routes, errors };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchTripRoute }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TripMap);
