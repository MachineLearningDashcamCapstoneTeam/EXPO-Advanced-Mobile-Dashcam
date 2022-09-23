import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';


export default function SettingsScreen({navigation}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Apple', value: 'apple'},
      {label: 'Banana', value: 'banana'},
      {label: '1080p', value: '1080p'}
    ]);
    const [open1, setOpen1] = useState(false);
    const [value1, setValue1] = useState(null);
    const [items2, setItems2] = useState([
      {label: 'Front', value: 'front'},
      {label: 'Back', value: 'back'}
      
    ]);

    const saveSetting = async() => {
      try {
        await AsyncStorage.setItem('CameraResolution', value);
        await AsyncStorage.setItem('CameraType', value1);


        
      } catch(e) {

      }
    }
  
    return (
      <View style={styles.container}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />

        <DropDownPicker
          open={open1}
          value={value1}
          items={items2}
          setOpen={setOpen1}
          setValue={setValue1}
          setItems={setItems2}
        />
        <Button title="Save" onPress={() => saveSetting()} />
      </View>
    );
  }


 
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      backgroundColor: "#fff",
      alignSelf: "flex-end"
    },
    video: {
      flex: 1,
      alignSelf: "stretch"
    }
  });