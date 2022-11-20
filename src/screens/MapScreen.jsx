
import React from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';
import { Appbar, Card, Title, Button, Text, Divider } from 'react-native-paper';
import MapView, { Marker, Callout, Geojson, Polyline } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { gpsJsonToGoogleMarkers, gpsJsonToPolyline } from '../utils/geojson-utils';
import GlobalStyles from '../styles/global-styles';

const MapScreen = ({ route, navigation }) => {
    const { videoAsset } = route.params;
    const [mapRegion, setMapRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
    });
    const [markers, setMarkers] = useState([]);
    const [geojsonData, setGeojsonData] = useState([]);
    const [lines, setLines] = useState({});

    let loadGPSData = async () => {

        try {

            //* Get the file from the documents directory
            const filename = `${FileSystem.documentDirectory}${videoAsset.filename}.txt`;
            const result = await FileSystem.readAsStringAsync(filename, {
                encoding: FileSystem.EncodingType.UTF8
            });

            //* Get the gps data from json and set the initial map location
            const gpsData = JSON.parse(result);
            setMapRegion({
                latitude: gpsData.features[0].geometry.coordinates[1],
                longitude: gpsData.features[0].geometry.coordinates[0],
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            })

            //* Create the google gps markers using the gps data
            const gpsMarkers = gpsJsonToGoogleMarkers(gpsData);
            const polylines = gpsJsonToPolyline(gpsData);
            setGeojsonData(gpsData);
            setLines(polylines);
            setMarkers(gpsMarkers);
        }
        catch (error) {
            Alert.alert(error);
        }
    };

    useEffect(() => {
        loadGPSData();

        return () => {
            //Reset all the use state variables
            setMapRegion({
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
            });

            setMarkers([]);
        }
    }, [])




    return (
        <View style={GlobalStyles.container}>
            <View style={[GlobalStyles.mapContainer]}>
                <MapView style={GlobalStyles.map}
                    region={mapRegion}
                    showsBuildings={true}
                    showsTraffic={true}
                    showsMyLocationButton={true}
                    mapType={'terrain'}
                    showsCompass={true}
                    toolbarEnabled={true}>

                    {markers &&
                        <Polyline
                            coordinates={lines.lines}
                            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeColors={lines.colors}
                            strokeWidth={5}
                        />

                    }


                    {markers &&
                        markers.map((marker, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: marker.latitude,
                                    longitude: marker.longitude,
                                }}

                                title={marker.title}
                                description={marker.subtitle}
                                pinColor={marker.color}
                            >


                                <Callout tooltip>
                                    <View>

                                        <View style={[GlobalStyles.bubble]}>

                                            <Text variant='titleMedium'>
                                                {marker.title}
                                            </Text>
                                            <Text variant='labelSmall'>
                                                Speed : {marker.subtitle}
                                            </Text>
                                            <Text variant='labelSmall'>
                                                Heading : {marker.heading}
                                            </Text>
                                            <Text variant='labelSmall'>
                                                Altitude : {marker.altitude}
                                            </Text>


                                        </View>

                                        <View style={[GlobalStyles.arrowBorder]} />
                                        <View style={[GlobalStyles.arrow]} />

                                    </View>

                                </Callout>

                            </Marker>
                        ))}
                </MapView>
            </View>
        </View>

    )
}

export default MapScreen;