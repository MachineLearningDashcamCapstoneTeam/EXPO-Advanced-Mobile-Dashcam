import { timeStampToDate, googleDriveFileTimestampToData } from './fetch-time';

export const groupByTime = (video_array) => {
    try {
        let temp_array = video_array.reduce((r, a) => {
            let dateTime = timeStampToDate(a.creationTime);
            r[dateTime] = [...r[dateTime] || [], a];
            return r;
        }, {});

        return temp_array;
    }
    catch (err) {
        console.log(err);
    }

}

export const groupGoogleFilesByTime = (video_array) => {
    try {
        let temp_array = video_array.reduce((r, a) => {
            let dateTime = googleDriveFileTimestampToData(a.createdTime);
            r[dateTime] = [...r[dateTime] || [], a];
            return r;
        }, {});

        return temp_array;
    }
    catch (err) {
        console.log(err);
    }

}

export const sortByTimeRecentToOldest = (video_array) => {
     
    const keys = Object.keys(video_array);

    // Sort the array of keys
    keys.sort().reverse();

    // Create a new object using the sorted array of keys
    const sortedObj = {};
    for (const key of keys) {
        sortedObj[key] = video_array[key];
    }

    return sortedObj;
}

export const sortByTimeOldestToRecent = (video_array) => {
     
    const keys = Object.keys(video_array);

    // Sort the array of keys
    keys.sort();

    // Create a new object using the sorted array of keys
    const sortedObj = {};
    for (const key of keys) {
        sortedObj[key] = video_array[key];
    }

    return sortedObj;
}
