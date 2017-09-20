import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchTripRoute} from '../actions';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.scss';
import {convertTimeToMinutes} from '../utilities/convert_time';
import _ from 'lodash';

var memoize = require('memoizee');

import json from '../../tripdata.json';

class TimeSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      requested_trips: []
    }
  }

  handleOnChange = (value) => {
    this.setState({
      time: value
    })
  }

  componentWillMount() {

  }

  fetchRoutes() {
    var trips = _.filter(json, (o) => {
      return (
        convertTimeToMinutes(o.starttime) <= this.state.time &&
        convertTimeToMinutes(o.stoptime) >= this.state.time
      )
    });

    var trips_coordinates = _.map(trips, (trip) => {
      var requested_trip = {
        start_station: {
          lng: trip["start station longitude"],
          lat: trip["start station latitude"]
        },
        end_station: {
          lng: trip["end station longitude"],
          lat: trip["end station latitude"]
        }
      };

      this.props.fetchTripRoute(requested_trip);
      return requested_trip;
    });
  }

  render() {
    this.fetchRoutes();

    console.log("We're rendering. These are the routes:", this.props.routes);
    let {time} = this.state
    return (
      <Slider
        value={time}
        min={0}
        max={4}
        onChange={this.handleOnChange}
      />
    )
  }
}

function mapStateToProps({routes}) {
  return {routes};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchTripRoute: memoize(fetchTripRoute, { promise: true }, { profileName: 'Fetch Route' })}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeSlider);
