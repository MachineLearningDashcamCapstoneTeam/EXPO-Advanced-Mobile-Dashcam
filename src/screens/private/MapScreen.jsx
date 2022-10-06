
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Appbar, Card, Title, Button, Text, Divider } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import { timeStampToDate } from '../../utils/fetch-time';
const MapScreen = ({ route, navigation }) => {
    const { assetInfo } = route.params;
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [markers, setMarkers] = useState([]);

    let loadGPSData = async () => {

        const filename = `${FileSystem.documentDirectory}${assetInfo.filename}.txt`;
        const result = await FileSystem.readAsStringAsync(filename, {
            encoding: FileSystem.EncodingType.UTF8
        });

        const gpsData = JSON.parse(result);
        setMapRegion({
            latitude: gpsData[0].coords.latitude,
            longitude: gpsData[0].coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        })

        let tempList = []
        gpsData.forEach(function (gpsPoint) {
            const point = {
                latitude: gpsPoint.coords.latitude,
                longitude: gpsPoint.coords.longitude,
                title: 'GPS Point',
                subtitle: timeStampToDate(gpsPoint.timestamp)
            }
            tempList.push(point);
        });
        
        setMarkers(tempList);
    };

    useEffect(() => {
        loadGPSData();

        return () => {

        }
    }, [])



    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={mapRegion} showsBuildings={true} showsTraffic={true} showsMyLocationButton={true} mapType={'terrain'} showsCompass={true} toolbarEnabled={true}>


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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});


export default MapScreen;