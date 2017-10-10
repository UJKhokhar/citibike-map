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
        minDate={moment('07/01/17')}
        maxDate={moment('07/31/17')}
      />
    );
  }
}

Calendar.propTypes = propTypes;
