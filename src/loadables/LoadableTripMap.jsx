import React, { Component } from 'react';
import Loadable from 'react-loadable';

function Loading(props) {
  if (props.error) {
    return <div>Error!</div>
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}

const LoadTripMap = Loadable({
  loader: () => import('../components/TripMap'),
  loading: Loading,
  delay: 300,
});

export default class LoadableTripMap extends Component {
  render() {
    return <LoadTripMap />;
  }
}
