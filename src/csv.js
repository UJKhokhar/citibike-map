const csv = require('csvtojson');
const fs = require('fs');

tripData = [];

csv()
  .fromFile(__dirname + "/trips.csv")
  .on('json', (json) => { // this func will be called 3 times
  	tripData.push(json);
  })
  .on('done', () => {
    fs.writeFile("tripdata.json", JSON.stringify(tripData), function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
  });
