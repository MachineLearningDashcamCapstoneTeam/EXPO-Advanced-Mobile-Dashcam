import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Card, Title, Button, Text, Divider } from 'react-native-paper';

function HomeScreen({ navigation }) {

  return (
    <View style={styles.container}>



        <Card mode="elevated" style={styles.card}>
          <Card.Cover source={{ uri: 'https://www.vancouverplanner.com/wp-content/uploads/2019/07/sea-to-sky-highway.jpeg' }} />
          <Card.Content>
            <Title>Attention Drivers!</Title>
            <Text style={styles.bottomMargin} variant='labelSmall'>
              Laborum in ut consequat magna ipsum. Magna amet nisi exercitation ex nulla. Exercitation ut adipisicing voluptate irure.

            </Text>

            <Button style={styles.button} icon="camera" mode="contained" onPress={() => navigation.navigate('Camera')}>
              Camera
            </Button>

            <Button style={styles.button} icon="format-list-bulleted" mode="contained" onPress={() => navigation.navigate('VideoPicker')}>
              Videos
            </Button>

            <Button style={styles.button} icon="cog" mode="outlined" onPress={() => navigation.navigate('Settings')}>
              Settings
            </Button>

            <Button style={styles.button} icon="help-circle-outline" mode="outlined" onPress={() => navigation.navigate('Help')}>
              App Help
            </Button>


          </Card.Content>
        </Card>



      <View style={styles.attention}>
        <Title style={{color: 'white'}}>
          Recent Recordings
        </Title>
        <Text variant='labelSmall' style={{color: 'white'}}>
          Esse sint consectetur occaecat tempor et commodo laboris id fugiat. Minim laborum minim elit esse culpa amet id ullamco exercitation labore exercitation id commodo fugiat. Amet excepteur ad enim dolor commodo adipisicing nostrud sint id irure nulla laboris.
        </Text>
        <Text variant='labelSmall' style={{color: 'white', marginVertical: 10}}>
          - Advanced Mobile Dashcam
        </Text>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#244c98'
  },
  mainContainer: {
    //flex: 1,
  },
  button: {
    marginBottom: 5,
  },
  bottomMargin: {
    marginBottom: 10,
  },
  card:{
    
    //flex: 2,
  },
  attention: { 
    //flex: 1, 
    margin: 10,
    backgroundColor: "#244c98", 
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    
  }
});

export default HomeScreen;