class Video_Asset {
    constructor() {
        this.albumId = "";
        this.creationTime = 0;
        this.duration = 0;
        this.filename = "";
        this.height = 0;
        this.id = "";
        this.mediaType = "";
        this.modificationTime = 0;
        this.uri = "";
        this.width = 0;
     }
  }

class GeojsonPoint {
    constructor() {
        this.accuracy = "";
        this.altitude = "";
        this.altitudeAccuracy = "";
        this.heading = "";
        this.latitude = "";
        this.longitude = "";
        this.speed = "";
        this.mocked = false;
        this.timestamp = new Date();
    }
}

class GeojsonCollection {
    constructor() {
        this.type = "";
        this.features = [];
    }
}

class GeojsonFeature {
    constructor() {
        this.type = "";
        this.properties = {};
        this.geometry = {};
    }
}


