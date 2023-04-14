const request = require('request-promise-native');

const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = (body) => {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};

const fetchISSFlyOverTimes = (ip) => {
  const { latitude, longitude } = JSON.parse(ip);
  return request(`https://iss-flyover.herokuapp.com/json?lat=${latitude}&lon=${longitude}`);
};

const nextISSTimesForMyLocation = () => {

  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(times => {
    const { response } = JSON.parse(times);
    return response;
  });
};


module.exports = { nextISSTimesForMyLocation };