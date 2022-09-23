/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable dot-notation */
/* eslint-disable no-restricted-syntax */
export const gpsJsonToGeojson = (data) => {
  const geojson = { type: 'FeatureCollection', features: [] };
  for (const point of data) {
    const coordinate = [point.coords.longitude, point.coords.latitude];
    const properties = {
      "accuracy":point.coords.accuracy,
      "altitude":point.coords.altitude,
      "altitudeAccuracy": point.coords.altitudeAccuracy,
      "heading": point.coords.heading,
      "latitude": point.coords.latitude,
      "longitude": point.coords.longitude,
      "speed": point.coords.speed,
      "mocked" : point.mocked,
      "timestamp": point.timestamp,
    };
    const feature = { type: 'Feature', geometry: { type: 'Point', coordinates: coordinate }, properties };
    geojson.features.push(feature);
  }
  return geojson;
};

export default gpsJsonToGeojson;
