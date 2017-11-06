import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import moment from 'moment';
import PropTypes from 'prop-types';
import memoize from 'memoizee';
import _ from 'lodash';
import Calendar from './Calendar';
import { fetchTrips } from '../actions';
import '../../styles/calendar.scss';
import '../../styles/popup.scss';
import '../../styles/key.scss';
import convertSecondsToMinutes from '../utilities/convertSecondsToMinutes';

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_API_KEY,
});

const propTypes = {
  fetchTrips: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    error: PropTypes.string,
  }),
};

const defaultProps = {
  trips: {},
  routes: {},
  errors: {},
};

class TripMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: [-73.996188, 40.727791],
      zoom: [11.6],
      style: 'sprites',
      dateAndTime: moment('2017-09-01T07:00:00'),
      trip: null,
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.hidePopup = this.hidePopup.bind(this);

    this.memoizedTrips = memoize(this.props.fetchTrips, { length: 1 });
  }

  componentDidMount() {
    this.memoizedTrips(
      this.state.dateAndTime.format('YYYY-MM-DDTHH:mm:ssZ'),
    );
  }

  componentDidUpdate() {
    this.memoizedTrips(
      this.state.dateAndTime.format('YYYY-MM-DDTHH:mm:ssZ'),
    );
  }

  handlePathClick = (trip) => {
    this.setState({ trip });
  }

  handleDateChange(dateAndTime) {
    this.setState({
      dateAndTime,
    });
  }

  hidePopup() {
    this.setState({ trip: null });
  }

  renderPaths() {
    // Find a better way to only render paths for activeTrips
    const activeTrips = _.filter(this.props.trips, trip => (
      // Lets nix any trips that started and ended at the same station. Probably due to redocks
      trip.trip['start station id'] !== trip.trip['end station id'] &&
      moment(trip.trip.starttime).isSameOrBefore(this.state.dateAndTime) &&
      moment(trip.trip.stoptime).isSameOrAfter(this.state.dateAndTime)
    ));

    const longestTrips = _.filter(activeTrips, trip => (
      // Greater than or equal to 30 minutes and 1 second
      trip.trip.tripduration >= 1801
    ));

    const shortestTrips = _.filter(activeTrips, trip => (
      // Less than or equal to 10 minutes
      trip.trip.tripduration <= 600
    ));

    const mediumTrips = _.filter(activeTrips, trip => (
      // Greater than or equal to 10 minutes and 1 second
      // Less than or equal to 30 minutes and 1 second
      trip.trip.tripduration >= 601 &&
      trip.trip.tripduration <= 1800
    ));

    const longestPaths = _.map(longestTrips, trip => (
      <Feature
        key={trip.trip.bikeid}
        coordinates={trip.coords}
        onClick={this.handlePathClick.bind(this, trip)}
      />
    ));

    const mediumPaths = _.map(mediumTrips, trip => (
      <Feature
        key={trip.trip.bikeid}
        coordinates={trip.coords}
        onClick={this.handlePathClick.bind(this, trip)}
      />
    ));

    const shortestPaths = _.map(shortestTrips, trip => (
      <Feature
        key={trip.trip.bikeid}
        coordinates={trip.coords}
        onClick={this.handlePathClick.bind(this, trip)}
      />
    ));

    const startStations = _.map(activeTrips, trip => (
      <Feature
        key={trip.trip['start station id']}
        coordinates={[
          trip.trip['start station longitude'],
          trip.trip['start station latitude'],
        ]}
      />
    ));

    const endStations = _.map(activeTrips, trip => (
      <Feature
        key={trip.trip['end station id']}
        coordinates={[trip.trip['end station longitude'], trip.trip['end station latitude']]}
      />
    ));

    return (
      <div>
        <div className="numactive">
          <b>{activeTrips.length}</b> active trips on {this.state.dateAndTime.format('dddd, MMMM Do YYYY [at] h:mma')}
        </div>
        <Layer
          type="line"
          paint={{
            'line-width': 3,
            'line-opacity': .75,
            'line-color': '#f39057',
          }}
        >
          {longestPaths}
        </Layer>
        <Layer
          type="line"
          paint={{
            'line-width': 3,
            'line-opacity': .75,
            'line-color': '#73d0ec',
          }}
        >
          {mediumPaths}
        </Layer>
        <Layer
          type="line"
          paint={{
            'line-width': 3,
            'line-opacity': .75,
            'line-color': '#aee59f',
          }}
        >
          {shortestPaths}
        </Layer>
        <Layer
          type="symbol"
          id="startstation"
          layout={{ 'icon-image': 'start-location-15' }}
        >
          {startStations}
        </Layer>
        <Layer
          type="symbol"
          id="endstation"
          layout={{ 'icon-image': 'end-location-15' }}
        >
          {endStations}
        </Layer>
      </div>
    );
  }

  render() {
    return (
      <div>
        {!_.isEmpty(this.props.errors) && (
          <div className="error">{this.props.errors.error}</div>
        )}
        <Map
          center={this.state.center}
          onClick={this.hidePopup}
          style={this.state.style}
          zoom={this.state.zoom}
          containerStyle={{
            height: '100vh',
            width: '100vw',
          }}
        >
          {!_.isEmpty(this.props.trips) && (
            <div>{this.renderPaths()}</div>
          )}
        </Map>
        <Calendar selected={this.state.dateAndTime} onChange={this.handleDateChange} />
        <div className="key">
          <p><span className="short" />Trips under 10 minutes</p>
          <p><span className="medium" />Trips between 10 minutes and 30 minutes</p>
          <p><span className="long" />Trips over 30 minutes</p>
        </div>
        {this.state.trip != null && (
          <div className="popup">
            <ul>
              <li><b>Start Station: </b>{this.state.trip.trip['start station name']}</li>
              <li><b>End Station: </b>{this.state.trip.trip['end station name']}</li>
              <li>
                <b>Trip Duration: </b>
                {convertSecondsToMinutes(this.state.trip.trip.tripduration)}
              </li>
              <li><b>Start Time: </b>{moment(this.state.trip.trip.starttime).format('HH:mm:ss')}</li>
              <li><b>End Time: </b>{moment(this.state.trip.trip.stoptime).format('HH:mm:ss')}</li>
            </ul>
          </div>
        )}
      </div>
    );
  }
}

TripMap.propTypes = propTypes;
TripMap.defaultProps = defaultProps;

function mapStateToProps({ trips, routes, errors }) {
  return { trips, routes, errors };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchTrips }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TripMap);
