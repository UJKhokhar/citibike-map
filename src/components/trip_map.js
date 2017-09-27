import React, { Component } from 'react';
import {connect} from 'react-redux';
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidW1vIiwiYSI6ImNqNjU0bTNoNjF5NDczM3A4eHFuMTBiMXgifQ.LJoaUT85C0dkAZDNYjhRYQ"
});

class TripMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: [-74.0059, 40.7128],
      zoom: [11],
      trips: {}
    }
  }

  render() {
    return (
      <Map
        accessToken="pk.eyJ1IjoidW1vIiwiYSI6ImNqNjU0bTNoNjF5NDczM3A4eHFuMTBiMXgifQ.LJoaUT85C0dkAZDNYjhRYQ"
        style="mapbox://styles/mapbox/streets-v9"
        center={this.state.center}
        zoom={this.state.zoom}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
        <GeoJSONLayer
          data={{
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "geometry": {
                  "type": "LineString",
                  "coordinates": [
                    [-74.043131, 40.719561],
                    [-74.037183, 40.7177],
                    [-74.038264, 40.712436],
                    [-74.038516, 40.712466]
                  ]
                }
              },
              {
                "type": "Feature",
                "geometry": {
                  "type": "LineString",
                  "coordinates": [
                    [-73.98891, 40.733122],
                    [-73.994118, 40.735313],
                    [-73.996976, 40.731414],
                    [-74.000066, 40.732929],
                    [-74.00001, 40.733004]
                  ]
                }
              }
            ]
          }}
          lineLayout={{
            "line-cap": "round"
          }}
          linePaint={{
            "line-width": 4,
            "line-color": "#FA3C00"
          }}
        />
      </Map>
    )
  }
}

function mapStateToProps({trips}) {
  return {trips};
}

export default connect(mapStateToProps)(TripMap);
