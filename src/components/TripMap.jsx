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
      center: [-74.0059, 40.7128],
      zoom: [11],
      style: 'mapbox://styles/mapbox/streets-v9',
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
      moment(trip.trip.starttime).isSameOrBefore(this.state.dateAndTime) &&
      moment(trip.trip.stoptime).isSameOrAfter(this.state.dateAndTime)
    ));

    const paths = _.map(activeTrips, trip => (
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
        <div className="numactive"><b>{activeTrips.length}</b> active trips on {this.state.dateAndTime.format('dddd, MMMM Do YYYY [at] h:mm:ssa')}</div>
        <Layer
          type="line"
          paint={{
            'line-width': 3,
          }}
        >
          {paths}
        </Layer>
        <Layer
          type="symbol"
          id="startstation"
          layout={{ 'icon-image': 'bicycle-share-15' }}
        >
          {startStations}
        </Layer>
        <Layer
          type="symbol"
          id="endstation"
          layout={{ 'icon-image': 'circle-15' }}
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
