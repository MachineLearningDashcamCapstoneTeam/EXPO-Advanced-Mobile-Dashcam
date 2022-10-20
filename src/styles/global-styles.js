import { StyleSheet, Dimensions } from 'react-native';

const main = '#1E49E1';
const smoke = '#EFF8E2';
const white = '#ffffff';
const dark = '#26272e';
const error = "#DF2935";
const success = "#679436";
const warning = "#FC9E4F";
const secondary = '#141B41';

const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: white,
    },

    flex1: {
        flex: 1,
        padding: 20,
    },
    flex2: {
        flex: 2,
        padding: 20,
    },
    flex3: {
        flex: 3,
        padding: 20,
    },
    flex4: {
        flex: 4,
        padding: 20,
    },
    flex5: {
        flex: 5,
        padding: 20,
    },
    flex6: {
        flex: 6,
        padding: 20,
    },

    button: {
        padding: 5,
        marginBottom: 5,
    },
    bottomMargin: {
        marginBottom: 10,
    },
    divSmoke: {
        backgroundColor: smoke,
    },
    divWhite: {
        backgroundColor: white,
    },
    divDanger: {
        backgroundColor: error,
    },

    divSpaceBetween:{
        justifyContent: 'space-between',
    },

    header: {

        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        padding: 20,
        paddingVertical: 20,
        backgroundColor: main,
        justifyContent: 'center',
        color: 'white',

   

    },

    buttonDanger:{
        backgroundColor: error,
    },

    buttonSuccess: {
        backgroundColor: success,
    },
    buttonWarning:{
        backgroundColor: warning,
    },
    buttonSecondary:{
        backgroundColor: secondary,
    },

    divCenter: {
        justifyContent: 'center',
    },

    paddingYsm: {
        paddingVertical: 10,
    },

    attention: {
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        padding: 20,
        paddingVertical: 20,
        backgroundColor: dark,
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
    },
    whiteText: {
        color: 'white'
    },
    video: {
        alignSelf: "stretch",
        width: window.full,
        height: 350,
        marginBottom: 10,
    },

    camera: {
        flex: 1,
    },

    card: {
        marginBottom: 0,
    },


    mapContainer: {
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

export default GlobalStyles;