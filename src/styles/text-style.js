import { StyleSheet, Dimensions, StatusBar } from 'react-native';
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


const TextStyles = StyleSheet.create({

    fontBold: {
        fontWeight: '100',
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
    textWhite: {
        color: white,
    },
    textDark: {
        color: dark,
    },
    textBlack: {
        color: black,
    },
    textSmoke: {
        color: smoke,
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

    dividerWhite: {
        color: white,
        backgroundColor: white,
    },
    smallGreenDot: {
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        color: success,
    },
    smallRedDot: {
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        color: error,
    },
});
export default TextStyles;