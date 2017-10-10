const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

const tripData = [];

csv()
  .fromFile(path.join(__dirname, 'trips.csv'))
  .on('json', (json) => {
    tripData.push(json);
  })
  .on('done', () => {
    fs.writeFile('tripdata.json', JSON.stringify(tripData), (err) => {
      if (err) {
        return console.log(err);
      }

      return console.log('The file was saved!');
    });
  });
