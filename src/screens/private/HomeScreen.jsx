import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuthentication } from '../../hooks/useAuthentication';
import { Button, Text, Divider } from 'react-native-paper';
import { getAuth, signOut } from 'firebase/auth';
const auth = getAuth();
function HomeScreen({ navigation }) {
  const { user } = useAuthentication();

  return (
    <View style={styles.container}>

      <Text variant='headlineSmall'>
        Home Page!
      </Text>

      <Text variant='labelLarge'>
        Esse sit exercitation dolor veniam tempor reprehenderit id veniam eu aliquip ex et.
      </Text>
      <Divider />
      <Button style={styles.button} icon="camera" mode="contained" onPress={() => navigation.navigate('Camera')}>
        Camera
      </Button>

      <Button style={styles.button} icon="format-list-bulleted" mode="contained" onPress={() => navigation.navigate('VideoPicker')}>
        Videos
      </Button>

      <Button style={styles.button} icon="cog" mode="outlined" onPress={() => navigation.navigate('Settings')}>
        Settings
      </Button>

      <Button style={styles.button} icon="account" mode="outlined" onPress={() => signOut(auth)}>
        Sign Out
      </Button>
      <Divider />

      <Text variant='labelLarge'>
        Dolore adipisicing ut commodo id cillum ea sint in cupidatat. Cillum incididunt qui amet ad. Irure magna ex ex mollit minim culpa consectetur nisi non minim nulla sunt ad. Eu voluptate consectetur est tempor nisi consectetur proident aliqua.
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  button: {
    marginVertical: 10,
  }

});

export default HomeScreen;