import { StyleSheet, Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const main = 'rgb(41, 72, 161)';
const gray = 'rgb(116, 116, 116)';
const white = 'rgb(255, 255, 255)';
const dark = 'rgb(37, 37, 37)';
const black = 'rgb(0,0,0)';
const error = "#DF2935";
const success = "#679436";
const warning = "#FC9E4F";
const smoke =  'rgb(250, 250, 250)';
const navbarBlackTrans = 'rgba(0,0,0, 0.4)'
const navbarBlack = '#000000';
const small = 10;
const medium = 20;
const large = 30;
const border = 10;


const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
    },

    quarterFlex: {
        marginHorizontal: 1,
        width: windowWidth*0.22,
    },

    textGray: {
        color: gray,
    },
    textMain: {
        color: main,
    },
    textError: {
        color: error,
    },
    textSuccess: {
        color: success,
    },
    textWarning: {
        color: warning,
    },




    height100: {
        height: 90,
    },

    marginBsm: {
        marginBottom: small,
    },

    flex1: {
        flex: 1,
        padding: medium,
    },
    flex2: {
        flex: 2,
        padding: medium,
    },
    flex3: {
        flex: 3,
        padding: medium,
    },
    flex4: {
        flex: 4,
        padding: medium,
    },
    flex5: {
        flex: 5,
        padding: medium,
    },
    flex6: {
    
        flex: 6,
        padding: medium,
    },


    button: {
        padding: 1,
    },

    buttonLg: {
        padding: 5,
        marginBottom: 5,
    },



    borderRounded: {
        borderRadius: border,
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
   

    rowContainerWrap: {
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: 'row',
        
        marginHorizontal: "auto",
    },

    buttonMain: {
        backgroundColor: main,
    },
    buttonDanger: {
        backgroundColor: error,
    },
    buttonDangerOutline: {
        color: error,
        borderColor: error,
        backgroundColor: white,
    },

    buttonSuccess: {
        backgroundColor: success,
    },
    buttonWarning: {
        backgroundColor: warning,
    },
  
    divCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    paddingBsm: {
        paddingBottom: 10,
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
    },

    divBlackTrans: {
        backgroundColor: navbarBlackTrans,
    },

    divBlack: {
        backgroundColor: navbarBlack,
    }

});

export default GlobalStyles;