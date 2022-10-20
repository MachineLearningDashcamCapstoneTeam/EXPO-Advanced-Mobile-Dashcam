import { StyleSheet, Dimensions } from 'react-native';

const main = '#456de4';
const smoke = '#f8f9fd';
const white = '#ffffff';
const dark = '#181d3d';
const error = "#DF2935";
const success = "#679436";
const warning = "#FC9E4F";
const secondary = '#6233f5';

const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
       
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

    divDark:{
        backgroundColor: dark,
    },
    divMain:{
        backgroundColor: main,
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
        padding: 20,
        paddingVertical: 20,
        justifyContent: 'center',
        color: 'white',
        borderBottomLeftRadius: 30,
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: "auto",
        
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
    paddingYmd: {
        paddingVertical: 20,
    },

    attention: {
        borderTopRightRadius: 30,
       
        padding: 20,
        paddingVertical: 20,
    
        justifyContent: 'center',
        color: 'white',
    },
    whiteText: {
        color: 'white'
    },
    video: {
        alignSelf: "stretch",
        width: window.full,
        height: 300,
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