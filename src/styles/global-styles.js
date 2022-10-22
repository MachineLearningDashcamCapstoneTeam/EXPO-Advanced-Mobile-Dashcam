import { StyleSheet, Dimensions } from 'react-native';

const main = '#456de4';
const smoke = '#f8f9fd';
const gray = '#b5b5b5';
const white = '#ffffff';
const dark = '#181d3d';
const navbarBlackTrans = 'rgba(0,0,0, 0.4)'
const navbarBlack = '#000000';
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
        padding: 1,
    },
    borderRounded: {
        borderRadius: 15,
    },
    buttonContainer: {
        flex: 1,
        marginHorizontal: 2,
    },

    avatarContainer: {
        flex: 1,
        marginHorizontal: 2,
    },
    avatarImg: {
        flex: 1,
        justifyContent: 'center',
    },
    avatarText: {
        flex: 3,
        justifyContent: 'center',
    },

    buttonLg: {
        padding: 5,
        marginBottom: 5,
    },
    marginYsm: {
        marginVertical: 10,
    },
    marginYmd: {
        marginBottom: 20,
    },
    marginYlg: {
        marginBottom: 30,
    },
    divDark: {
        backgroundColor: dark,
    },
    divMain: {
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
    divSpaceBetween: {
        justifyContent: 'space-between',
    },
    header: {
        padding: 20,
        paddingVertical: 20,
        justifyContent: 'center',
        color: white,
        borderBottomLeftRadius: 30,
    },
    attention: {
        borderTopRightRadius: 30,
        padding: 20,
        paddingVertical: 20,

        color: 'white',
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: "auto",
    },

    buttonMain: {
        backgroundColor: main,
    },
    buttonDanger: {
        backgroundColor: error,
    },
    buttonSuccess: {
        backgroundColor: success,
    },
    buttonWarning: {
        backgroundColor: warning,
    },
    buttonSecondary: {
        backgroundColor: secondary,
    },
    divCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    paddingYsm: {
        paddingVertical: 10,
    },
    paddingYmd: {
        paddingVertical: 20,
    },
    paddingYlg: {
        paddingVertical: 30,
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
        justifyContent: 'space-between',
    },


    divBlackTrans: {
        backgroundColor: navbarBlackTrans,
    },

    divBlack: {
        backgroundColor: navbarBlack,
    },

    rowSpaceEven: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        display: 'flex',
        flexDirection: 'row',
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
        width: '100%',
        height: '100%',
    },
    divLine: {
        borderBottomColor: gray,
        borderBottomWidth: StyleSheet.hairlineWidth,
    }

});

export default GlobalStyles;