import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';
import moment from 'moment';
import PropTypes from 'prop-types';
import memoize from 'memoizee';
import _ from 'lodash';
import Calendar from './Calendar';
import TimeSlider from './TimeSlider';
import { fetchTrips, fetchTripRoute } from '../actions';
import convertMinutesToTime from '../utilities/convertMinutesToTime';

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_API_KEY,
});

const propTypes = {
  fetchTripRoute: PropTypes.func.isRequired,
  fetchTrips: PropTypes.func.isRequired,
  routes: PropTypes.shape({
    coords: PropTypes.object,
    trip: PropTypes.object,
  }),
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
      date: moment('2017-07-01'),
      time: 0,
      trip: null,
    };

    this.filterActiveTrips = this.filterActiveTrips.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.hidePopup = this.hidePopup.bind(this);

    this.memoizedTrips = memoize(this.props.fetchTrips, { length: 2 });

    this.memoizedRoutes = memoize(
      this.props.fetchTripRoute,
      {
        primitive: true,
        normalizer: args => JSON.stringify(args[0]),
      },
    );
  }

  componentDidMount() {
    this.memoizedTrips(
      this.state.date.format('YYYY-MM-DD'),
      convertMinutesToTime(this.state.time),
    );

    _.forEach(this.filterActiveTrips(this.props.trips), (trip) => {
      this.memoizedRoutes(trip);
    });
  }

  componentDidUpdate() {
    this.memoizedTrips(
      this.state.date.format('YYYY-MM-DD'),
      convertMinutesToTime(this.state.time),
    );

    _.forEach(this.filterActiveTrips(this.props.trips), (trip) => {
      this.memoizedRoutes(trip);
    });
  }

  handlePathClick = (trip) => {
    this.setState({ trip });
  }

  handleDateChange(date) {
    this.setState({
      date,
    });
  }

  handleTimeChange = (newTime) => {
    this.setState({
      time: newTime,
    });
  }

  hidePopup() {
    this.setState({ trip: null });
  }

  filterActiveTrips(trips) {
    return _.filter(trips, trip => (
      moment(trip.starttime).isSameOrBefore(`${this.state.date.format('YYYY-MM-DD')}T${convertMinutesToTime(this.state.time)}Z`, 'minute') &&
      moment(trip.stoptime).isSameOrAfter(`${this.state.date.format('YYYY-MM-DD')}T${convertMinutesToTime(this.state.time)}Z`, 'minute')
    ));
  }

  renderPaths() {
    // Find a better way to only render paths for activeTrips
    const activeTrips = _.filter(this.props.routes, trip => (
      moment(trip.trip.starttime).isSameOrBefore(`${this.state.date.format('YYYY-MM-DD')}T${convertMinutesToTime(this.state.time)}Z`, 'minute') &&
      moment(trip.trip.stoptime).isSameOrAfter(`${this.state.date.format('YYYY-MM-DD')}T${convertMinutesToTime(this.state.time)}Z`, 'minute')
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
        <Layer
          type="line"
          paint={{
            'line-width': 6,
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
          {this.renderPaths()}
          {!_.isEmpty(this.props.routes) && (
            <div>
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
          )}
        </Map>
        <TimeSlider value={this.state.time} onChange={this.handleTimeChange} />
        <Calendar selected={this.state.date} onChange={this.handleDateChange} />
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
  return bindActionCreators({ fetchTrips, fetchTripRoute }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TripMap);
