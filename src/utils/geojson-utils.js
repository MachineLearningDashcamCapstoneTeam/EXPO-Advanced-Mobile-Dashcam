/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable dot-notation */
/* eslint-disable no-restricted-syntax */
import { timeStampToDate } from '../utils/fetch-time';

export const gpsJsonToGeojson = (data) => {

  const geojson = { type: 'FeatureCollection', features: [] };

  data.forEach(function (point) {
    const coordinate = [point.coords.longitude, point.coords.latitude];
    const properties = {
      "accuracy": point.coords.accuracy,
      "altitude": point.coords.altitude,
      "altitudeAccuracy": point.coords.altitudeAccuracy,
      "heading": point.coords.heading,
      "latitude": point.coords.latitude,
      "longitude": point.coords.longitude,
      "speed": point.coords.speed,
      "mocked": point.mocked,
      "timestamp": point.timestamp,
    };
    const feature = { type: 'Feature', geometry: { type: 'Point', coordinates: coordinate }, properties };
    geojson.features.push(feature);
  });

  return geojson;
};

//* Google maps requires GPS marks. Raw Geojson does not work with Google Maps
export const gpsJsonToGoogleMarkers = (gpsData) => {
  let tempList = []
  gpsData.features.forEach(function (gpsPoint) {
    const point = {
      latitude: gpsPoint.geometry.coordinates[1],
      longitude: gpsPoint.geometry.coordinates[0],
      title: 'GPS Point',
      subtitle: timeStampToDate(gpsPoint.properties.timestamp)
    }
    tempList.push(point);
  });
  return tempList;
}

export default gpsJsonToGeojson;
