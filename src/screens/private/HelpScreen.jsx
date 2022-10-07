import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Appbar, Card, Title, Button, Text, Divider } from 'react-native-paper';
const HelpScreen = () => {
    return (
        <View style={styles.container}>

<Card mode="elevated" style={styles.card}>
          <Card.Cover source={{ uri: 'https://www.vancouverplanner.com/wp-content/uploads/2019/07/sea-to-sky-highway.jpeg' }} />
          <Card.Content>
            <Title>Help Drivers!</Title>
            <Text style={styles.bottomMargin} variant='labelSmall'>
              Laborum in ut consequat magna ipsum. Magna amet nisi exercitation ex nulla. Exercitation ut adipisicing voluptate irure.
              Nostrud Lorem sint veniam ut duis sunt reprehenderit labore deserunt cillum. Ut ipsum consectetur nulla eu sunt sint fugiat commodo. Quis adipisicing reprehenderit voluptate duis non culpa anim ex proident aliqua qui. Nostrud Lorem aliqua minim ex occaecat anim adipisicing. Ipsum ipsum anim Lorem fugiat pariatur occaecat anim nostrud voluptate elit incididunt proident aliqua aliquip.
              Nisi occaecat sunt consequat dolore. Excepteur labore nisi velit velit. Nostrud deserunt irure veniam deserunt pariatur voluptate. Proident exercitation pariatur et eiusmod dolore reprehenderit ad laborum aute dolore pariatur sunt ullamco. Anim nulla occaecat fugiat amet deserunt magna ipsum occaecat duis. Commodo occaecat sint labore elit incididunt reprehenderit exercitation sit cupidatat ea quis voluptate.
            </Text>

          </Card.Content>
        </Card>

    
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#244c98'
    },
    card: {
        marginBottom: 0,
    },
    button: {
        marginVertical: 5,
    },
});

export default HelpScreen;