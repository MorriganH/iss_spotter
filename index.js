const { nextISSTimesForMyLocation } = require('./iss');

// fetchMyIP((error, ip) => {

//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log("It worked! Returned IP:", ip);
// });

// fetchCoordsByIP('24.36.135.19', (error, coordinates) => {
//   if (error) {
//     console.log(error.message);
//     return;
//   }
//   console.log(coordinates);
// });

// fetchISSFlyOverTimes({latitude: 46, longitude: -64.716667}, (error, data) => {
//   if (error) {
//     console.log(error.message);
//     return;
//   }
//   console.log(data);
// });

const printPassTimes = (passTimes) => {

  for (const pass of passTimes) {

    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    
    const duration = pass.duration;
    console.log(`Next pass is at ${datetime} for ${duration} seconds`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {

  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  printPassTimes(passTimes);
});