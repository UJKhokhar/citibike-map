import React, { PureComponent } from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.scss';
import PropTypes from 'prop-types';

import convertMinutesToTime from '../utilities/convertMinutesToTime';

const propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

const defaultProps = {
  value: 420,
};

export default class TimeSlider extends PureComponent {
  render() {
    return (
      <Slider
        value={this.props.value}
        min={420}
        max={480}
        step={1}
        format={convertMinutesToTime}
        onChange={this.props.onChange}
      />
    );
  }
}

TimeSlider.propTypes = propTypes;
TimeSlider.defaultProps = defaultProps;
