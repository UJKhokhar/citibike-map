import React, { Component } from 'react';
import Loadable from 'react-loadable';

function Loading() {
  return <div>Loading...</div>;
}

const LoadTripMap = Loadable({
  loader: () => import('../components/TripMap'),
  loading: Loading,
});

export default class LoadableTripMap extends Component {
  render() {
    return <LoadTripMap />;
  }
}
