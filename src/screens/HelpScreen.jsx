import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Title, Button, Text, Divider } from 'react-native-paper';

import GlobalStyles from '../styles/global-styles';

const HelpScreen = () => {
    return (
        <View style={GlobalStyles.container}>


            <View style={[GlobalStyles.header, GlobalStyles.flex1]}>
                <Title style={GlobalStyles.whiteText}>Need Help?</Title>

                <Text style={GlobalStyles.whiteText} variant='labelLarge'>
                    The application is currently in development. If something breaks, just contact the development team.
                </Text>
            </View>

            <View style={[GlobalStyles.flex5]}>
                <Text variant='labelLarge'>
                    Laborum in ut consequat magna ipsum. Magna amet nisi exercitation ex nulla. Exercitation ut adipisicing voluptate irure.
                    Nostrud Lorem sint veniam ut duis sunt reprehenderit labore deserunt cillum. Ut ipsum consectetur nulla eu sunt sint fugiat commodo. Quis adipisicing reprehenderit voluptate duis non culpa anim ex proident aliqua qui. Nostrud Lorem aliqua minim ex occaecat anim adipisicing. Ipsum ipsum anim Lorem fugiat pariatur occaecat anim nostrud voluptate elit incididunt proident aliqua aliquip.
                    Nisi occaecat sunt consequat dolore. Excepteur labore nisi velit velit. Nostrud deserunt irure veniam deserunt pariatur voluptate. Proident exercitation pariatur et eiusmod dolore reprehenderit ad laborum aute dolore pariatur sunt ullamco. Anim nulla occaecat fugiat amet deserunt magna ipsum occaecat duis. Commodo occaecat sint labore elit incididunt reprehenderit exercitation sit cupidatat ea quis voluptate.
                </Text>
            </View>


            <View style={[GlobalStyles.attention, GlobalStyles.flex1]}>
            <Title style={GlobalStyles.whiteText}>
               Need more Help?
            </Title>
            <Text variant='labelLarge' style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]}>
                Contact us at: XYZ
            </Text>


            </View>



        </View>
    )
}

export default HelpScreen;