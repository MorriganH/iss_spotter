const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

/*
* Makes a single API request to retrieve the user's location data from a given IPv4 address.
* Input:
*   - The IP (ipv4) address of the user (string)
*   - A callback (to pass back an error or the latitude, longitude object)
* Returns (via Callback):
*   - An error, if any (nullable)
*   - An object with the latitude and longitude (null if error). Example: {latitude: 49, longitude: -100}
*/
const fetchCoordsByIP = (ip, callback) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const locationData = JSON.parse(body);

    if (!locationData.success) {
      const msg = `Failure to find data: ${locationData.message} when fetching IP address ${ip}`;
      callback(Error(msg), null);
      return;
    }

    const coordinates = {
      latitude: locationData.latitude,
      longitude: locationData.longitude
    };
    callback(null, coordinates);

  });
};


/*
* Makes a single API request to retrieve ISS flyover data from a given latitude and longitude
* Input:
*   - The latitude and longitude (object)
*   - A callback (to pass back an error or the flyover data array)
* Returns (via Callback):
*   - An error, if any (nullable)
*   - An array of objects with fly over data (null if error). Example [{risetime: 1234567890, duration: 600}, ...]
*/
const fetchISSFlyOverTimes = (coordinates, callback) => {
  request(`https://iss-flyover.herokuapp.com/json?lat=${coordinates.latitude}&lon=${coordinates.longitude}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
  
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const passTimes = JSON.parse(body).response;
    callback(null, passTimes);

  });
};

/*
* Orchestrates multiple API requests to determine the next 5 ISS fly overs for the user's location
* Input:
*   - A callback with an error or results
* Returns:
*   - An error, if any (nullable)
*   - The fly over times as an array (null if error). Example [{risetime: 1234567890, duration: 600}, ...]
*/
const nextISSTimesForMyLocation = (callback) => {

  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
        if (error) {
          return callback(error,null);
        }

        callback(null, passTimes);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };