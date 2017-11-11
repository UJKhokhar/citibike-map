# Citi Bike Map
This project takes Citi Bike's public data and displays it on a couple of maps. View it live [here](https://ujkhokhar.github.io/citibike-map/#/).

The first map (Station Map) displays all stations and how many bikes and docking spots are at each station. It pulls data from Citi Bike's real-time [General Bikeshare Feed Specification](http://gbfs.citibikenyc.com/gbfs/gbfs.json).

![Station Map](https://github.com/UJKhokhar/citibike-map/blob/master/readme-images/station-map.png)

The second map (Trip Map) is a little more complex. It displays Citi Bike trip history data from September. I limited this data to rush hour times of the first week of September to make trends clearer. It pulls from [Citi Bike's trip history](https://s3.amazonaws.com/tripdata/index.html). The map has a date and time selector and a request is made to a simple API. This API takes a date and time and returns all active trips at that time along with an array of Waypoints with coordinates that represent the route taken by the user. You can read more about the API and how it works in its [repository](https://github.com/UJKhokhar/citibike-map-api).

![Trip Map](https://github.com/UJKhokhar/citibike-map/blob/master/readme-images/trip-map.png)

### Tools
This app was built with React, Redux, Babel and Webpack. It also wouldn't have been possible without [Mapbox](https://www.mapbox.com/) and [alex3165's](https://github.com/alex3165)  [Mapbox react binding](https://github.com/alex3165/react-mapbox-gl).

### To Run Locally
You'll need to set up the [API](https://github.com/UJKhokhar/citibike-map-api) as well if you want to run this locally.

After cloning the repo:

`npm install` to install packages

`npm run start` to start a local webpack-dev-server

`npm run build` to compile a minified production ready build

## Credit
* [UJKhokhar](https://github.com/UJKhokhar/)
* [markalexandercastillo](https://github.com/markalexandercastillo)
