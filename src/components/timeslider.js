import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchTripRoute} from '../actions';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.scss';
import {convertTimeToMinutes} from '../utilities/convert_time';
import _ from 'lodash';

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

  componentDidMount() {
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

    console.log('Did mount', trips_coordinates);

  }

  render() {
    console.log("Render", this.props.routes);
    let {time} = this.state
    return (
      <Slider
        value={time}
        min={0}
        max={1440}
        onChange={this.handleOnChange}
      />
    )
  }
}

function mapStateToProps({routes}) {
  return {routes};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchTripRoute: fetchTripRoute}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeSlider);
