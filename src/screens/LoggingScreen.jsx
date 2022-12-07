import React, { useEffect, useState } from 'react';
import {  View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Card,  Text,  Divider } from 'react-native-paper';

import GlobalStyles from '../styles/global-styles';

const LoggingScreen = () => {
    const [loggingMessages, setLoggingMessages] = useState([]);

    const getLoggingMessages = async () => {
        try {
            const messages = await AsyncStorage.getItem('loggingMessages');
            const messagesArray = JSON.parse(messages);
            messagesArray ? setLoggingMessages(messagesArray) : setLoggingMessages([]);
        } catch (error) {
            setLoggingMessages([]);
        }
    }

    useEffect(() => {
        getLoggingMessages();
    }, []);

    const renderLoggingMessages = () => {
        if (loggingMessages.length) {
            return (loggingMessages.map(message => (
                <Card key={message.id} style={[GlobalStyles.roundedTop, GlobalStyles.roundedBottom, GlobalStyles.divWhite, GlobalStyles.marginYsm]}>
                    <Card.Content>
                        <Text variant='bodySmall'>
                            {message.message}
                        </Text>
                        <Text variant='bodySmall'>
                            {message.date}
                        </Text>
                    </Card.Content>
                </Card>

            )));
        }
        else {
            return (
                <Card style={[GlobalStyles.roundedTop, GlobalStyles.roundedBottom, GlobalStyles.divWhite, GlobalStyles.marginYsm]}>
                    <Card.Content>
                        <Text variant='titleLarge'>
                            Details
                        </Text>
                        <Divider style={[GlobalStyles.marginYsm]} />
                        <Text variant='bodySmall'>
                            No logging messages found. Please try again later.
                        </Text>
                    </Card.Content>
                </Card>
            );
        }
    }


    const clearLoggingMessages = async () => {
        try {
            setLoggingMessages([]);
            await AsyncStorage.removeItem('loggingMessages');
        } catch (error) {
            console.error(error);
        }
    }

    const addRandomArray = async () => {
        // Generate a random array of objects with id, title, message, and date properties
        const randomArray = [...Array(10)].map((_, index) => ({
            id: index,
            title: `Title ${index}`,
            message: `This is message ${index}`,
            date: new Date().toISOString(),
        }));

        const newLoggingMessages = [...loggingMessages, ...randomArray];
        await AsyncStorage.setItem('loggingMessages', JSON.stringify(newLoggingMessages));
    };

    return (
        <View style={[GlobalStyles.container, GlobalStyles.statusbarMargin]}>
            <ScrollView >

                <View style={[GlobalStyles.divMain, GlobalStyles.paddingXmd, GlobalStyles.paddingYmd]}>
                    <Text variant='titleLarge' style={GlobalStyles.whiteText}>Logging Messages</Text>
                    <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant="bodySmall">
                        All logging messages are saved here. Use the button below to clear all messages.
                    </Text>
                </View>


                <View style={[GlobalStyles.flex1]}>
                    {renderLoggingMessages()}
                </View>
            </ScrollView>
        </View>
    );
}

export default LoggingScreen;
