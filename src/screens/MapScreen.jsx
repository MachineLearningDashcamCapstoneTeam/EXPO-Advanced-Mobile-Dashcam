
import React from 'react';
import { View, Alert } from 'react-native';
import { Card, Text, IconButton, MD3Colors, Modal, Portal, Provider } from 'react-native-paper';
import MapView, { Marker, Callout, Polyline } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { gpsJsonToGoogleMarkers, gpsJsonToPolyline } from '../utils/geojson-utils';
import GlobalStyles from '../styles/global-styles';
import HYBRID_IMG from '../../assets/map/hybrid.jpg';
import SATELLITE_IMG from '../../assets/map/satellite.jpg';
import STANDARD_IMG from '../../assets/map/standard.jpg';
import TERRAIN__IMG from '../../assets/map/terrain.jpg';
const MapScreen = ({ route, navigation }) => {
    const { videoAsset } = route.params;
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.773972,
        longitude: -122.4194,
        latitudeDelta: 0,
        longitudeDelta: 0,
        zoom: 10,
    });
    const [mapStyle, setMapStyle] = useState({
        id: 0,
        name: 'Standard',
        style: 'standard',
        uri: STANDARD_IMG,
    });
    const [showMarkers, setShowMarkers] = useState(true);
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
            if (result) {
                //* Get the gps data from json and set the initial map location
                const gpsData = JSON.parse(result);
                if (gpsData === null) throw 'No GPS Data exists';

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
            else {
                
                setGeojsonData([]);
                setLines([]);
                setMarkers([]);

              
            }

        }
        catch (error) {
            Alert.alert(
                'Error',
                `No GPS data exists.`,
                [
                  { text: 'OK' },
                ]
              );
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

    const mapStylesArray = [
        {
            id: 0,
            name: 'Standard',
            style: 'standard',
            uri: STANDARD_IMG,
        },
        {
            id: 1,
            name: 'Satellite',
            style: 'satellite',
            uri: SATELLITE_IMG,
        },
        {
            id: 2,
            name: 'Hybrid',
            style: 'hybrid',
            uri: HYBRID_IMG,
        },
        {
            id: 3,
            name: 'Terrain',
            style: 'terrain',
            uri: TERRAIN__IMG,
        }
    ];
    const changeMapStyle = (style) => {
        setMapStyle(style);
    };
    const toggleMarkers = () => {
        setShowMarkers(!showMarkers);
    };

    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };
    return (
        <Provider>
            <View style={GlobalStyles.container}>

                <View style={[GlobalStyles.container, GlobalStyles.mapContainer]}>
                    {markers && markers.length > 0 && (
                        <MapView style={GlobalStyles.map}
                            region={mapRegion}
                            showsBuildings={true}
                            showsTraffic={true}
                            showsMyLocationButton={true}
                            showsUserLocation={true}
                            mapType={mapStyle.style}
                            showsCompass={true}
                            toolbarEnabled={true}
                            showsScale={true}
                            rotateEnabled={true}
                            loadingEnabled={true}
                            loadingIndicatorColor={MD3Colors.blue500}
                            isAccessibilityElement={true}
                        >
                            {(markers.length && showMarkers) &&
                                <Polyline
                                    coordinates={lines.lines}
                                    strokeColor="#000"
                                    strokeColors={lines.colors}
                                    strokeWidth={5}
                                />
                            }

                            {(markers.length && showMarkers) &&
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
                                ))
                            }
                        </MapView>
                    )}

                    {markers.length === 0 && (
                        <MapView style={GlobalStyles.map}
                            region={mapRegion}
                            showsBuildings={true}
                            showsTraffic={true}
                            showsMyLocationButton={true}
                            showsUserLocation={true}
                            mapType={mapStyle.style}
                            showsCompass={true}
                            toolbarEnabled={true}
                            showsScale={true}
                            rotateEnabled={true}
                            loadingEnabled={true}
                            loadingIndicatorColor={MD3Colors.blue500}
                            isAccessibilityElement={true}
                        >
                        </MapView>
                    )}

                </View>
                <View style={[GlobalStyles.mapDetailsContainer, GlobalStyles.flexRow, GlobalStyles.divSpaceBetween]}>

                    <Card style={[GlobalStyles.divDark, GlobalStyles.roundedTop, GlobalStyles.roundedBottom]} elevation={5}>
                        <IconButton
                            icon={'layers'}
                            iconColor={MD3Colors.neutral100}
                            size={22}
                            onPress={showModal}
                        />

                        <IconButton
                            icon={'map-marker'}
                            iconColor={MD3Colors.neutral100}
                            size={22}
                            onPress={toggleMarkers}
                        />
                    </Card>
                </View>


                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Text variant="bodyLarge">Map Styles</Text>
                        <Card style={[GlobalStyles.divDark, GlobalStyles.roundedTop, GlobalStyles.roundedBottom, GlobalStyles.marginYsm]} elevation={5}>
                            <Card.Content>
                                <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.divSpaceBetween]}>
                                    {
                                        mapStylesArray.map((mapStyle) => (
                                            <Card key={mapStyle.id} mode="elevated" onPress={() => { changeMapStyle(mapStyle) }} style={[GlobalStyles.styleCard, GlobalStyles.borderRounded]}>
                                                <Card.Cover source={mapStyle.uri} style={[GlobalStyles.styleCard, GlobalStyles.borderRounded]} />
                                            </Card>
                                        ))
                                    }
                                </View>
                            </Card.Content>
                        </Card>
                    </Modal>
                </Portal>
            </View>
        </Provider>
    )
}
export default MapScreen;