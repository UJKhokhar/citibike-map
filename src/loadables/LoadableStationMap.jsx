import React, { Component } from 'react';
import Loadable from 'react-loadable';

function Loading() {
  return <div>Loading...</div>;
}

const LoadStationMap = Loadable({
  loader: () => import('../components/StationMap'),
  loading: Loading,
});

export default class LoadableStationMap extends Component {
  render() {
    return <LoadStationMap />;
  }
}
