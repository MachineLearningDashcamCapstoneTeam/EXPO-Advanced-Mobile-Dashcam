/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable dot-notation */
/* eslint-disable no-restricted-syntax */
import { timeStampToDate } from '../utils/fetch-time';

const SPEED_COLORS = ["#fa6e6e", "#fa9b45", "#fbf01c", "#88ed02", "#13c600", "#00ba73", "#00a9d1", "#0093ff", "#0071ff", "#1800ff"];
//* Get a color for every 10km/h
//* Example: 0-9Km/h, 10-19km/h
export const getVehicleSpeedColor = (speed) => {
  let speedIndex = parseInt(speed / 10, 10);
  speedIndex = speedIndex >= SPEED_COLORS.length ? SPEED_COLORS.length - 1 : speedIndex;
  return SPEED_COLORS[speedIndex];
};

//* Get the speed from the properties object
//* Speed is sometimes not found in the object, in that case, return 0
const getSpeed = (properties) => {
  let speed = 0;
  for (const [key, value] of Object.entries(properties)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('speed')) {
      speed = value;
    }
  }
  return speed;
};

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
      title: timeStampToDate(gpsPoint.properties.timestamp).toString(),
      subtitle: `${gpsPoint.properties.speed.toFixed(2)}km/h`,
      color: getVehicleSpeedColor(gpsPoint.properties.speed.toFixed(2)),
      heading: gpsPoint.properties.heading,
      altitude: gpsPoint.properties.altitude,
      altitudeAccuracy: gpsPoint.properties.altitudeAccuracy,
    }
    tempList.push(point);
  });
  return tempList;
}


export const gpsJsonToPolyline = (gpsData) => {

  const polylines = { lines: [], colors : [] };
  gpsData.features.forEach(function (gpsPoint) {
    const point = {
      latitude: gpsPoint.geometry.coordinates[1],
      longitude: gpsPoint.geometry.coordinates[0],
    }
    let color = getSpeed(getVehicleSpeedColor(gpsPoint.properties.speed.toFixed(2)));
    polylines.colors.push(color);
    polylines.lines.push(point);
  });
  return polylines;
}



export default gpsJsonToGeojson;
