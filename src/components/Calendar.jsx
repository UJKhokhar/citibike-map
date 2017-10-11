import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import '../../styles/test.scss';

const propTypes = {
  selected: PropTypes.instanceOf(moment).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default class Calendar extends PureComponent {
  render() {
    return (
      <DatePicker
        inline
        selected={this.props.selected}
        onChange={this.props.onChange}
        minDate={moment('2017-07-01')}
        maxDate={moment('2017-07-31')}
      />
    );
  }
}

Calendar.propTypes = propTypes;
