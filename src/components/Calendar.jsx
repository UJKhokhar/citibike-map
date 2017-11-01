import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import PropTypes from 'prop-types';
import '../../styles/calendar.scss';

const propTypes = {
  selected: PropTypes.instanceOf(moment).isRequired,
  onChange: PropTypes.func.isRequired,
};

const excludedTimes = [
  moment().hours(0).minutes(0),
  moment().hours(0).minutes(15),
  moment().hours(0).minutes(30),
  moment().hours(0).minutes(45),
  moment().hours(1).minutes(0),
  moment().hours(1).minutes(15),
  moment().hours(1).minutes(30),
  moment().hours(1).minutes(45),
  moment().hours(2).minutes(0),
  moment().hours(2).minutes(15),
  moment().hours(2).minutes(30),
  moment().hours(2).minutes(45),
  moment().hours(3).minutes(0),
  moment().hours(3).minutes(15),
  moment().hours(3).minutes(30),
  moment().hours(3).minutes(45),
  moment().hours(4).minutes(0),
  moment().hours(4).minutes(15),
  moment().hours(4).minutes(30),
  moment().hours(4).minutes(45),
  moment().hours(5).minutes(0),
  moment().hours(5).minutes(15),
  moment().hours(5).minutes(30),
  moment().hours(5).minutes(45),
  moment().hours(6).minutes(0),
  moment().hours(6).minutes(15),
  moment().hours(6).minutes(30),
  moment().hours(6).minutes(45),
  moment().hours(9).minutes(15),
  moment().hours(9).minutes(30),
  moment().hours(9).minutes(45),
  moment().hours(10).minutes(0),
  moment().hours(10).minutes(15),
  moment().hours(10).minutes(30),
  moment().hours(10).minutes(45),
  moment().hours(11).minutes(0),
  moment().hours(11).minutes(15),
  moment().hours(11).minutes(30),
  moment().hours(11).minutes(45),
  moment().hours(12).minutes(0),
  moment().hours(12).minutes(15),
  moment().hours(12).minutes(30),
  moment().hours(12).minutes(45),
  moment().hours(13).minutes(0),
  moment().hours(13).minutes(15),
  moment().hours(13).minutes(30),
  moment().hours(13).minutes(45),
  moment().hours(14).minutes(0),
  moment().hours(14).minutes(15),
  moment().hours(14).minutes(30),
  moment().hours(14).minutes(45),
  moment().hours(15).minutes(0),
  moment().hours(15).minutes(15),
  moment().hours(15).minutes(30),
  moment().hours(15).minutes(45),
  moment().hours(18).minutes(15),
  moment().hours(18).minutes(30),
  moment().hours(18).minutes(45),
  moment().hours(19).minutes(0),
  moment().hours(19).minutes(15),
  moment().hours(19).minutes(30),
  moment().hours(19).minutes(45),
  moment().hours(20).minutes(0),
  moment().hours(20).minutes(15),
  moment().hours(20).minutes(30),
  moment().hours(20).minutes(45),
  moment().hours(21).minutes(0),
  moment().hours(21).minutes(15),
  moment().hours(21).minutes(30),
  moment().hours(21).minutes(45),
  moment().hours(22).minutes(0),
  moment().hours(22).minutes(15),
  moment().hours(22).minutes(30),
  moment().hours(22).minutes(45),
  moment().hours(23).minutes(0),
  moment().hours(23).minutes(15),
  moment().hours(23).minutes(30),
  moment().hours(23).minutes(45),
];

export default class Calendar extends PureComponent {
  render() {
    return (
      <DatePicker
        selected={this.props.selected}
        onChange={this.props.onChange}
        inline
        showTimeSelect
        timeIntervals={15}
        minDate={moment('2017-09-01')}
        maxDate={moment('2017-09-07')}
        excludeTimes={excludedTimes}
        dateFormat="LLL"
      />
    );
  }
}

Calendar.propTypes = propTypes;
