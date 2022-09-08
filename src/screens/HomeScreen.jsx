import * as React from 'react';
import { View, Text } from 'react-native';

function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>

    
  );
}

export default HomeScreen;
