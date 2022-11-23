export const DEFAULT_CAMERA_SETTINGS = {
    'loadCameraWhenApplicationStarts': false,
    'resolution': '480p',
    'cameraType': 'Back',
    'zoomLevel': 0,
    'recordingLength': 1,
    'maxVideoFileSize': 4294967296,
    'automaticRecording': false,
    'allowUploadWithMobileData': false,

};

const [loadCamera, setLoadCamera] = useState();
const [selectedResolution, setSelectedResolution] = useState();
const [selectedCameraType, setSelectedCameraType] = useState();
const [selectedZoom, setSelectedZoom] = useState();
const [selectedRecLength, setSelectedRecLength] = useState();
const [selectedMaxSize, setSelectedMaxSize] = useState();
const [selectedAutoRec, setSelectedAutoRec] = useState();
const [selectedMobileData, setSelectedMobileData] = useState();