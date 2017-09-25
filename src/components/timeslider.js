import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchTripRoute} from '../actions';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.scss';
import {convertTimeToMinutes} from '../utilities/convert_time';
import _ from 'lodash';

import json from '../../tripdata.json';

export default class TimeSlider extends Component {
  render() {
    return (
      <Slider
        value={this.props.value}
        min={0}
        max={11}
        onChange={this.props.onChange}
      />
    )
  }
}
