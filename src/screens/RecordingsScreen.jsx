import { Button, Text, List, Searchbar, Card, Modal, Portal, Provider, IconButton, MD3Colors } from 'react-native-paper';
import { View, ScrollView, Alert } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { ALBUM_NAME, } from '../constants';
import { groupByTime, groupGoogleFilesByTime, sortByTimeRecentToOldest, sortByTimeOldestToRecent } from '../utils/sorting-video-assets';
import { getDashcamVideos, deleteGoogleDriveFile } from '../services/googleDriveService';
import { AccessContext } from '../context/accessTokenContext';
import GoogleVideoCard from '../widget/googleVideoCard';
import GlobalStyles from '../styles/global-styles';
import LocalVideoCard from '../widget/localVideoCard';


export default function RecordingsScreen({ navigation }) {
  const { accessTokenContextValue, setAccessTokenContextValue } = useContext(AccessContext);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);


  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20 };

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
      const sortedArray = sortByTimeRecentToOldest(groupedArray);
      setVideos(sortedArray);
    } catch (error) {
      Alert.alert(
        'Error',
        `Unable to load Videos from the Album ${error}`,
        [
          { text: 'OK' },
        ]
      );
    }

    if (accessTokenContextValue) {
      getDriveFiles();
    }
  }

  const getInfo = async (asset) => {
    await MediaLibrary.getAssetInfoAsync(asset).then((info) => {
      navigation.navigate('Video Player', { videoAsset: info });
    }).catch((error) => {
      Alert.alert(
        'Error',
        `Unable to load Video Info`,
        [
          { text: 'OK' },
        ]
      );
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
  const sortByTimeOldToRecent = () => {
    try {
    const tempList = videos;
    const sortedArray = sortByTimeOldestToRecent(tempList)
    setVideos(sortedArray)
  }
  catch (error) {
    Alert.alert(
      'Error',
      `Unable to sort the video list`,
      [
        { text: 'OK' },
      ]
    );
  }
  }
  //* Sort the videos and reset the initial video list
  const sortByTimeRecentToOld = () => {
    try {
      const tempList = videos;
      const sortedArray = sortByTimeRecentToOldest(tempList)
      setVideos(sortedArray)
    }
    catch (error) {
      Alert.alert(
        'Error',
        `Unable to sort the video list`,
        [
          { text: 'OK' },
        ]
      );
    }
  }
  //* To reset the video list, use the sortByTimeRecentToOldest function
  const resetVideoList = () => {
    try {
      const tempList = videos;
      const sortedArray = sortByTimeRecentToOldest(tempList)
      setVideos(sortedArray)
    }
    catch (error) {
      Alert.alert(
        'Error',
        `Unable to reset the video list`,
        [
          { text: 'OK' },
        ]
      );
    }
  }



  const filtersArray = [
    {
      id: 0,
      name: 'Recent to Oldest',
      icon: 'sort-calendar-descending',
      func: sortByTimeRecentToOld,
    },
    {
      id: 1,
      name: 'Oldest to Recent',
      icon: 'sort-calendar-ascending',
      func: sortByTimeOldToRecent,
    },
    {
      id: 2,
      name: 'Reset',
      icon: 'refresh',
      func: resetVideoList,
    },


  ];

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
      Alert.alert(
        'Success',
        `File Deleted`,
        [
          { text: 'OK' },
        ]
      );
    }
    else {
      Alert.alert(
        'Error',
        `Unable to delete file`,
        [
          { text: 'OK' },
        ]
      );
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

    <Provider>
      <View style={[GlobalStyles.container, GlobalStyles.statusbarMargin]}>


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



          <View style={GlobalStyles.flex1}>


            <View style={[GlobalStyles.flexRow, GlobalStyles.divSpaceBetween]}>
              <View style={[GlobalStyles.flex4, GlobalStyles.noPadding, GlobalStyles.marginRsm]}>
                <Searchbar
                  placeholder="Search"
                  onChangeText={onChangeSearch}
                  value={searchQuery}
                  style={[GlobalStyles.borderRoundedHalf, GlobalStyles.divWhite]}
                />
              </View>

              {selectedMenu === 0 && 
              <View style={[ GlobalStyles.noPadding]}>
                <Card style={[GlobalStyles.divDark, GlobalStyles.roundedTop, GlobalStyles.roundedBottom]} elevation={5}>
                  <IconButton
                    icon={'layers'}
                    iconColor={MD3Colors.neutral100}
                    size={22}
                    onPress={showModal}
                  />


                </Card>
              </View>
}
            </View>
            {videoWidgets()}
          </View>
        </ScrollView>


        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <Text variant="bodyLarge">Filters</Text>
            <Card style={[GlobalStyles.divDark, GlobalStyles.roundedTop, GlobalStyles.roundedBottom, GlobalStyles.marginYsm]} elevation={5}>
              <Card.Content>

                <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.divSpaceBetween]}>

                  {
                    filtersArray.map((filterItem) => (

                      <IconButton
                        key={filterItem.id}
                        icon={filterItem.icon}
                        iconColor={MD3Colors.neutral100}
                        size={22}
                        onPress={() => { filterItem.func() }}
                      />
                    ))
                  }
                </View>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      </View>

    </Provider>
  );
}
