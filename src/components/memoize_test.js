import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import _ from 'lodash';
import { fetchTripRoute } from '../actions';
import {convertTimeToMinutes} from '../utilities/convert_time';
var memoize = require('memoizee');
import json from '../../tripdata.json';

// Map Stuff
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidW1vIiwiYSI6ImNqNjU0bTNoNjF5NDczM3A4eHFuMTBiMXgifQ.LJoaUT85C0dkAZDNYjhRYQ"
});

// Class Stuff
class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      num: 0,
      center: [-74.0059, 40.7128],
      zoom: [11]
    };

    this.handleClick = this.handleClick.bind(this);

    // Memoize so that we don't make the same request twice
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

      this.memoized(requested_trip);
      return requested_trip;
    });
  }

  handleClick() {
    this.fetchRoutes();
    this.setState({num: this.state.num + 1});
  }

  renderPaths() {
    return _.map(this.props.routes, (coords) => {
      var obj = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": coords
        }
      }

      return obj;
    });
  }

  render() {
    return (
      <div>
        <div onClick={this.handleClick}>
          CLICK ME
        </div>
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
            )
          }
        </Map>
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
