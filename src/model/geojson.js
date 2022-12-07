
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

