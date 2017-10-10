import React, { Component } from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import moment from 'moment';
import Calendar from './Calendar';

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_API_KEY,
});

export default class TestMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: [-74.0059, 40.7128],
      zoom: [11],
      style: 'mapbox://styles/mapbox/streets-v9',
      date: moment('07/01/17'),
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      date,
    });

    
  }

  render() {
    return (
      <div>
        <Map
          style={this.state.style}
          center={this.state.center}
          zoom={this.state.zoom}
          containerStyle={{
            height: '100vh',
            width: '100vw',
          }}
        />
        <Calendar
          selected={this.state.date}
          onChange={this.handleChange}
          minDate={moment('07/01/17')}
          maxDate={moment('07/31/17')}
        />
      </div>
    );
  }
}
