//! Attention, these types are only used for documentation

type Video_Asset = {
    "albumId": string; // The id contains numbers and letters
    "creationTime": number;
    "duration": number;
    "filename": string;
    "height": number;
    "id": string; // The id only contains numbers, but the variable is treated as a string
    "mediaType": string;
    "modificationTime": number;
    "uri": string; // Url in the form of a string
    "width": number;
};

// * A geojson point are the individual markers on the map
type GeojsonPoint = {
    "accuracy": string;
    "altitude": string;
    "altitudeAccuracy": string;
    "heading": string;
    "latitude": string;
    "longitude": string;
    "speed": string;
    "mocked": boolean;
    "timestamp": Date;
}

type GeojsonCollection = {
    type: String; //* Usually, the default type is 'FeatureCollection'
    features: GeojsonPoint[] //* Holds an array of geojson points as objects
};



