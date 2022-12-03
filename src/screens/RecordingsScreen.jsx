import { Card, Button, Text, DataTable, List, Searchbar, Divider } from 'react-native-paper';
import { View, ScrollView, Alert, Image } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { ALBUM_NAME, AMD_SETTINGS } from '../constants';
import { groupByTime, groupGoogleFilesByTime, sortByLengthShortToLong, sortByLengthLongToShort, sortByTimeRecentToOldest, sortByTimeOldestToRecent } from '../utils/sorting-video-assets';
import { getDashcamVideos, deleteGoogleDriveFile } from '../services/googleDriveService';
import { AccessContext } from '../context/accessTokenContext';
import GoogleVideoCard from '../widget/googleVideoCard';
import GlobalStyles from '../styles/global-styles';
import LocalVideoCard from '../widget/localVideoCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecordingsScreen({ navigation }) {
  const { accessTokenContextValue, setAccessTokenContextValue } = useContext(AccessContext);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);

  //* Local Videos, favorites, and Google Drive Files
  const [videos, setVideos] = useState([]);
  const [googleDriveFiles, setGoogleDriveFiles] = useState([]);

  const setPermissions = async () => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    //* If the user has permission, load the video data
    if (mediaLibraryPermission.status === 'granted') {
      getAlbumData();
    }
  }
  const getAlbumData = async () => {
    try {
      const selectedAlbum = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      const assets = await MediaLibrary.getAssetsAsync({ album: selectedAlbum.id, mediaType: 'video' });
      const groupedArray = groupByTime(assets['assets']);
      setVideos(groupedArray);
    } catch (error) {
      console.log(error);
      Alert.alert("Unable to load Videos from the Album");
    }
  
    if (accessTokenContextValue) {
      console.log('Getting Google Drive Files')
      getDriveFiles();
    }
  }

  const getInfo = async (asset) => {
    await MediaLibrary.getAssetInfoAsync(asset).then((info) => {
      navigation.navigate('Video Player', { videoAsset: info });
    }).catch((error) => {
      Alert.alert("Unable to load Asset Information");
    });
  }
  useEffect(() => {
    setPermissions();

    const unsubscribe = navigation.addListener('focus', () => {
      getAlbumData();
    });


    return () => {
      setHasMediaLibraryPermission(null);
      setVideos([]);
      unsubscribe;
    };
  }, [navigation]);


  //* Sort the videos and reset the initial video list
  const sortByLengthASC = () => {
    const tempList = videos;
    const sortedArray = sortByLengthShortToLong(tempList)
    setVideos([...sortedArray])
  }
  //* Sort the videos and reset the initial video list
  const sortByLengthDSC = () => {
    const tempList = videos;
    const sortedArray = sortByLengthLongToShort(tempList)
    setVideos([...sortedArray])
  }
  //* Sort the videos and reset the initial video list
  const sortByTimeASC = () => {
    const tempList = videos;
    const sortedArray = sortByTimeOldestToRecent(tempList)
    setVideos([...sortedArray])
  }
  //* Sort the videos and reset the initial video list
  const sortByTimeDSC = () => {
    const tempList = videos;
    const sortedArray = sortByTimeRecentToOldest(tempList)
    setVideos([...sortedArray])
  }
  //* To reset the video list, use the sortByTimeRecentToOldest function
  const resetVideoList = () => {
    const tempList = videos;
    const sortedArray = sortByTimeRecentToOldest(tempList)
    setVideos([...sortedArray])
  }
  //* Google drive conditions
  const getDriveFiles = async () => {
    const response = await getDashcamVideos(accessTokenContextValue);
    if (response.status === 200) {
      let tempList = response.data.files;
      tempList = tempList.filter((videoFile) => videoFile.fileExtension === "MP4" || videoFile.fileExtension === "mp4");
      const groupedArray = groupGoogleFilesByTime(tempList);
      setGoogleDriveFiles(groupedArray)

    }
  };
  const deleteDriveFile = async (file) => {
    const response = await deleteGoogleDriveFile(accessTokenContextValue, file.id);
    if (response.status === 204) {

      let tempList = googleDriveFiles;
      tempList = tempList.filter(item => item.id !== file.id);
      setGoogleDriveFiles([...tempList])
      Alert.alert("Deleted video from Google Drive");
    }
  }



  const renderGoogleListItem = (key, value) => {
    const titleMessage = `${key}  ${value.length} video(s)`
    if (titleMessage.includes(searchQuery)) {
      return <View key={key}>
        <List.Accordion
          style={[GlobalStyles.divWhite]}
          title={titleMessage}
          left={props => <List.Icon {...props} icon="folder" />}>
          <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
            {
              value.map((file) => (
                ((file.fileExtension === "MP4" || file.fileExtension === "mp4" || file.fileExtension === 'jpg') &&
                  <GoogleVideoCard key={file.id} file={file} deleteDriveFile={deleteDriveFile} />
                )
              ))
            }
          </View>
        </List.Accordion>
      </View>
    }
    else {
      return null;
    }
  }


  const renderListItem = (key, value) => {
    const titleMessage = `${key}  ${value.length} video(s)`
    if (titleMessage.includes(searchQuery)) {
      return <View key={key}>
        <List.Accordion
          style={[GlobalStyles.divWhite]}
          title={titleMessage}
          left={props => <List.Icon {...props} icon="folder" />}>
          <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
            {
              value.map((videoAsset) => (
                <LocalVideoCard key={videoAsset.id} videoAsset={videoAsset} getInfo={getInfo} />
              ))
            }
          </View>
        </List.Accordion>

      </View>
    }
    else {
      return null;
    }
  }

  const videoWidgets = () => {
    if (selectedMenu === 0) {
      return (
        <View>
          <List.Section title="Recordings">
            {Object.entries(videos).map(([key, value]) => {
              return (
                renderListItem(key, value)
              );
            })}

          </List.Section>
        </View>
      )
    }
    else {
      return (
        <View>
          <List.Section title="Google Drive Recordings">
            {Object.entries(googleDriveFiles).map(([key, value]) => {
              return (
                renderGoogleListItem(key, value)
              );
            })}

          </List.Section>
        </View>
      )
    }
  }
  return (
    <View  style={[GlobalStyles.container, GlobalStyles.statusbarMargin]}>

   
    <ScrollView >
      <View style={[GlobalStyles.divMain,  GlobalStyles.paddingXmd, GlobalStyles.paddingYmd]}>
        <Text variant='titleLarge' style={GlobalStyles.whiteText}>{selectedMenu === 0 ? 'Local Videos' : 'Cloud Videos'}</Text>
        <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant="bodySmall">
          {selectedMenu === 0 ? 'Local Videos are recordings and GPS Data saved on the phone. Use filters to swift through the recordings.' : 'Cloud Videos are recordings and GPS Data saved on Google Drive.'}
        </Text>

      
        {accessTokenContextValue &&
          <Button style={[GlobalStyles.button, GlobalStyles.divWhite]} icon="filter" mode="elevated" onPress={() => selectedMenu === 0 ? setSelectedMenu(1) : setSelectedMenu(0)} >{selectedMenu === 0 ? 'Cloud Videos' : 'Local Videos'}</Button>
        }
      </View>



      <View style={GlobalStyles.flex5}>

        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={[GlobalStyles.borderRoundedHalf, GlobalStyles.divWhite]}
        />
        {videoWidgets()}
      </View>
    </ScrollView>
    </View>
  );
}
