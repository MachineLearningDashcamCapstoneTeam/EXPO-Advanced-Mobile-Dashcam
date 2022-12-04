import { StyleSheet, Dimensions , StatusBar} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const main = '#142D5E';
const gray = '#F5F7FB';
const white = 'rgb(255, 255, 255)';
const dark = 'rgb(37, 37, 37)';
const black = 'rgb(0,0,0)';
const error = "#DF2935";
const success = "#679436";
const warning = "#FC9E4F";
const smoke = 'rgb(250, 250, 250)';
const navbarBlackTrans = 'rgba(0,0,0, 0.4)'
const navbarBlack = '#000000';
const small = 10;
const medium = 20;
const large = 30;
const border = 20;


const MapStyles = StyleSheet.create({

    mapContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    map: {
        width: '100%',
        height: '100%',
        position: 'absolute',

    },

    mapDetailsContainer: {

        padding: medium,

    },

    bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
        width: 150,
    },
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
    },

});

export default MapStyles;