import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import _ from 'lodash';
import { fetchTripRoute } from '../actions';
import {convertTimeToMinutes} from '../utilities/convert_time';
var memoize = require('memoizee');
import json from '../../tripdata.json';

class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      num: 0
    };

    this.handleClick = this.handleClick.bind(this);
    this.memoized = memoize(this.props.fetchTripRoute, { primitive: true, normalizer: function(args) {
      return JSON.stringify(args[0]);
    }});
  }

  fetchRoutes() {
    var trips = _.filter(json, (o) => {
      return (
        convertTimeToMinutes(o.starttime) <= this.state.num &&
        convertTimeToMinutes(o.stoptime) >= this.state.num
      )
    });

    console.log("Trips", trips);

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

      console.log('REQUESTED_TRIP', requested_trip);

      this.memoized(requested_trip);
      return requested_trip;
    });
  }

  handleClick() {
    this.fetchRoutes();

    this.setState({num: this.state.num + 1});
  }

  render() {
    console.log('num:', this.state.num)
    return (
      <div onClick={this.handleClick}>
        Hi
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchTripRoute}, dispatch);
}

export default connect(null, mapDispatchToProps)(Test);
