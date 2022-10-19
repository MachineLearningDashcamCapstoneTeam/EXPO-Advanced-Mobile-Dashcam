

import React from 'react'
import { Card, Button, Title, Text, Searchbar } from 'react-native-paper';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';

const GoogleVideoCard = ({ file, deleteDriveFile }) => {
    return (
        <Card key={file.id} mode="elevated" style={styles.card}>
            <Card.Cover source={{ uri: file.thumbnailLink }} />
            <Card.Content>
                <Title>{file.id}</Title>


                <Text variant='labelSmall'>
                    Created: {file.createdTime}
                </Text>

                <Text variant='labelSmall'>
                    Owner: {file.owners[0].displayName}
                </Text>

                <Text style={styles.bottomMargin} variant='labelSmall'>
                    Size: {file.size}
                </Text>

                <Button style={styles.button} icon="delete" mode="outlined" onPress={() => deleteDriveFile(file)} > Delete</Button>


            </Card.Content>
        </Card>
    )
}


const styles = StyleSheet.create({

    card: {
        marginBottom: 10,
    },
    bottomMargin: {
        marginBottom: 10,
    }

});

export default GoogleVideoCard;