import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthentication } from '../../hooks/useAuthentication';
import { Button } from 'react-native-elements';
import { getAuth, signOut } from 'firebase/auth';
const auth = getAuth();
function HomeScreen({navigation }) {
  const { user } = useAuthentication();

  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}!</Text>

      <Button
        title="Go to Camera"
        onPress={() => navigation.navigate('Camera')}
      />

<Button
        title="Go to Video Picker"
        onPress={() => navigation.navigate('VideoPicker')}
      />

      <Button title="Sign Out" style={styles.button} onPress={() => signOut(auth)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10
  }
});

export default HomeScreen;