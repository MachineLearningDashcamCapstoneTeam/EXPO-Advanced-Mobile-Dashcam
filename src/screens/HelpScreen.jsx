import React from 'react';
import { View, ScrollView } from 'react-native';
import { Title, Text, List, Card } from 'react-native-paper';

import GlobalStyles from '../styles/global-styles';

const HelpScreen = () => {


    const FAQs = {
        'About': {
            'icon': 'information',
            'data': [
                {
                    title: 'Who created this app?',
                    content: 'This Application was Created by the Sheridan College AMD Capstone team.'
                },
                {
                    title: 'What use this app?',
                    content: 'This app is used to record video of the road ahead and the vehicle occupants.'
                },
                {
                    title: 'What is a dashcam?',
                    content: 'A dashcam is a camera that is mounted to the dashboard of a vehicle. It is used to record video of the road ahead and the vehicle occupants.'
                },
            ],
        },
        'Recordings': {
            'icon': 'video',
            'data': [
                {
                    title: 'How do I record a video?',
                    content: 'To record a video, press the record button on the camera screen. The video will be saved to your device. You can also setup the app to automatically record when you start your vehicle.'
                },
                {
                    title: 'How do I view my recordings?',
                    content: 'To view your recordings, press the menu button on the camera screen and select "Recordings". You can also select the list icon in the bottom navigation bar.'
                },
                {
                    title: 'How do I delete a recording?',
                    content: 'To delete a recording, press the menu button on the camera screen and select "Recordings". You can also select the list icon in the bottom navigation bar. Press the trash icon on the recording you want to delete.'
                },

            
            ]
        },  

        'Settings': {
            'icon': 'cog',
            'data': [
                {
                    title: 'How do I change the settings?',
                    content: 'To change the settings, press the menu button on the camera screen and select "Settings". You can also select the cog icon in the bottom navigation bar.'
                },
                {
                    title: 'How do I change the resolution?',
                    content: 'To change the resolution, press the menu button on the camera screen and select "Settings". You can also select the cog icon in the bottom navigation bar. Press the "Resolution" button and select the resolution you want to use.'
                },
                {
                    title: 'How do I change the load camera when application starts?',
                    content: 'To change the load camera when application starts, press the menu button on the camera screen and select "Settings". You can also select the cog icon in the bottom navigation bar. Press the "Load Camera When Application Starts" button and select the option you want to use.'
                },
            ]
        },

        'Privacy': {
            'icon': 'shield-account',
            'data': [
                {
                    title: 'What information does this app collect?',
                    content: 'This app does not collect any information.'
                },
                {
                    title: 'What information does this app share?',
                    content: 'This app does not share any information.'
                },
                {
                    title: 'How do I delete my account?',
                    content: 'This app does not have an account owned by the AMD Capstone team. The app makes use of Google Sign In to allow users to sign in to the app using their Google account. If you wish to delete your Google account, please visit https://myaccount.google.com/ and follow the instructions.'
                },
            ]
        },
    }



    return (
        <View style={[GlobalStyles.container]}>
            <ScrollView >
                <View style={[GlobalStyles.divMain, GlobalStyles.paddingXmd, GlobalStyles.paddingYmd]}>
                    <Text variant='titleLarge' style={GlobalStyles.whiteText}>Frequently Asked Questions</Text>
                    <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant="bodySmall">
                        This is a list of frequently asked questions. If you have a question that is not answered here, please contact us.
                    </Text>
                </View>

                <View style={[GlobalStyles.flex1]}>

                    {Object.entries(FAQs).map(([key, value]) => {

                        return (
                            <List.Section key={key} title={key}>

                                {value.data.map((item, index) => {

                                    return (
                                        <List.Accordion
                                            key={index}
                                            title={item.title}
                                            left={props => <List.Icon {...props} icon={value.icon} />}>
                                            <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
                                                <Card mode="elevated" style={[GlobalStyles.borderRounded]} >
                                                    <Card.Content>
                                                        <View style={[GlobalStyles.marginYsm]}>
                                                            <Text variant='bodySmall'>{item.content}</Text>
                                                        </View>
                                                    </Card.Content>
                                                </Card>
                                            </View>
                                        </List.Accordion>
                                    )

                                })}

                            </List.Section>
                        )

                    })}
                </View>
            </ScrollView>
        </View>
    )
}

export default HelpScreen;