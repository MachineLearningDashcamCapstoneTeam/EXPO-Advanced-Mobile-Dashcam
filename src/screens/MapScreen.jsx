
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Appbar, Card, Title, Button, Text, Divider } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { gpsJsonToGoogleMarkers } from '../utils/geojson-utils';
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

    let loadGPSData = async () => {

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
        setMarkers(gpsMarkers);
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
        <View style={GlobalStyles.mapContainer}>
            <MapView style={GlobalStyles.map}
                region={mapRegion}
                showsBuildings={true}
                showsTraffic={true}
                showsMyLocationButton={true}
                mapType={'terrain'}
                showsCompass={true}
                toolbarEnabled={true}>

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
                        />
                    ))}
            </MapView>
        </View>
    )
}

export default MapScreen;