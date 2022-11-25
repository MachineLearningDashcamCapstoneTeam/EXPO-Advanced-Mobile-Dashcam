import { Card, Button, Text, DataTable, List, Searchbar } from 'react-native-paper';
import { View, ScrollView, Alert, Image } from 'react-native';
import { useEffect, useState, useContext } from 'react';


const RenderGoogleListItem = ({key, value}) => {
    const titleMessage = `${key}  ${value.length} video(s)`
  
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
  export default RenderGoogleListItem;