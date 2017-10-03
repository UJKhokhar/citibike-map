import React, { PureComponent } from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.scss';
import PropTypes from 'prop-types';

const propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

const defaultProps = {
  value: 0,
};


export default class TimeSlider extends PureComponent {
  render() {
    return (
      <Slider
        value={this.props.value}
        min={0}
        max={11}
        onChange={this.props.onChange}
      />
    );
  }
}

TimeSlider.propTypes = propTypes;
TimeSlider.defaultProps = defaultProps;
