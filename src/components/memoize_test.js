import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import _ from 'lodash';
import { fetchTripRoute } from '../actions';
import {convertTimeToMinutes} from '../utilities/convert_time';
var memoize = require('memoizee');
import json from '../../tripdata.json';
import TimeSlider from '../components/timeslider.js';

// Map Stuff
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature } from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidW1vIiwiYSI6ImNqNjU0bTNoNjF5NDczM3A4eHFuMTBiMXgifQ.LJoaUT85C0dkAZDNYjhRYQ"
});

// Class Stuff
class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      center: [-74.0059, 40.7128],
      zoom: [11]
    };

    // Memoize so that we don't make the same request twice
    this.memoized = memoize(this.props.fetchTripRoute, { primitive: true, normalizer: function(args) {
      return JSON.stringify(args[0]);
    }});
  }

  fetchRoutes() {
    var trips = _.filter(json, (o) => {
      return (
        convertTimeToMinutes(o.starttime) <= this.state.time &&
        convertTimeToMinutes(o.stoptime) >= this.state.time
      )
    });

    for (var i = 0; i < trips.length; i++) {
      this.memoized(trips[i]);
    }
  }

  handleChange = (value) => {
    this.fetchRoutes();
    this.setState({
      time: value
    });
  }

  renderPaths() {
    var active_trips = _.filter(this.props.routes, (trip) => {
      return (convertTimeToMinutes(trip.trip.starttime) <=  this.state.time && convertTimeToMinutes(trip.trip.stoptime) >= this.state.time)
    });

    var geo_array = _.map(active_trips, (trip) => {
        var obj = {
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": trip.coords
          }
        }
        return obj;
    });

    return geo_array;
  }

  renderStartStations() {
    console.log(this.props.routes);
    var active_trips = _.filter(this.props.routes, (trip) => {
      return (convertTimeToMinutes(trip.trip.starttime) <=  this.state.time && convertTimeToMinutes(trip.trip.stoptime) >= this.state.time)
    });

    return _.map(active_trips, (trip) => {
      return (
        <Feature
          key={trip.trip["start station id"]}
          coordinates={[trip.trip["start station longitude"], trip.trip["start station latitude"]]}
        />
      )
    });
  }

  renderEndStations() {
    var active_trips = _.filter(this.props.routes, (trip) => {
      return (convertTimeToMinutes(trip.trip.starttime) <=  this.state.time && convertTimeToMinutes(trip.trip.stoptime) >= this.state.time)
    });

    return _.map(active_trips, (trip) => {
      return (
        <Feature
          key={trip.trip["end station id"]}
          coordinates={[trip.trip["end station longitude"], trip.trip["end station latitude"]]}
        />
      )
    });
  }

  render() {
    return (
      <div>
        <Map
          accessToken="pk.eyJ1IjoidW1vIiwiYSI6ImNqNjU0bTNoNjF5NDczM3A4eHFuMTBiMXgifQ.LJoaUT85C0dkAZDNYjhRYQ"
          style="mapbox://styles/mapbox/streets-v9"
          center={this.state.center}
          zoom={this.state.zoom}
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}>
          {
            !_.isEmpty(this.props.routes) && (
              <div>
                <Layer
                  type="symbol"
                  id="startstation"
                  layout={{ "icon-image": "bicycle-share-15" }}>
                  {this.renderStartStations()}
                </Layer>
                <Layer
                  type="symbol"
                  id="endstation"
                  layout={{ "icon-image": "circle-15" }}>
                  {this.renderEndStations()}
                </Layer>
                <GeoJSONLayer
                  data={{
                    "type": "FeatureCollection",
                    "features": this.renderPaths()
                  }}
                  lineLayout={{
                    "line-cap": "round"
                  }}
                  linePaint={{
                    "line-width": 6,
                    "line-color": "#FA3C00"
                  }}
                />
            </div>
            )
          }
        </Map>
        <TimeSlider value={this.state.time} onChange={this.handleChange}/>
      </div>
    )
  }
}

function mapStateToProps({routes}) {
  return {routes};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchTripRoute}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
