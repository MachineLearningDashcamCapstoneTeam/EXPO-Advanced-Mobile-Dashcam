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
const border = 20;

const ButtonStyles = StyleSheet.create({
 
    button: {
        padding: 1,
        borderRadius: border/2,
    },
    buttonLg: {
        padding: 5,
        marginBottom: 5,
    },
    buttonContainer: {
        flex: 1,
        marginHorizontal: 2,
    },

    buttonMain: {
        backgroundColor: main,
    },
    buttonGray: {
        backgroundColor: gray,
    },
    buttonWhite: {
        backgroundColor: white,
    },
    buttonDark: {
        backgroundColor: dark,
    },
    buttonBlack: {
        backgroundColor: black,
    },
    buttonSmoke: {
        backgroundColor: smoke,
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
});
export default ButtonStyles;