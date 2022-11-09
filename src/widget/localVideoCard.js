

import React from 'react'
import { Card } from 'react-native-paper';
import GlobalStyles from '../styles/global-styles';

const LocalVideoCard = ({ videoAsset, getInfo }) => {

    return (
        <Card key={videoAsset.id} mode="elevated" onPress ={()=> getInfo(videoAsset)} style={[GlobalStyles.quarterFlex, GlobalStyles.height100, GlobalStyles.borderRounded, GlobalStyles.marginBsm]}>
            <Card.Cover source={{ uri: videoAsset.uri }} style={[GlobalStyles.height100, GlobalStyles.borderRounded]} />
            
        </Card>
    )
}

export default LocalVideoCard;