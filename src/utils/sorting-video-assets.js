import { timeStampToDate , googleDriveFileTimestampToData} from './fetch-time';

export const groupByTime = (video_array) => {
    try {
        let temp_array = video_array.reduce((r, a) => {
            let dateTime = timeStampToDate(a.creationTime);
            r[dateTime] = [...r[dateTime] || [], a];
            return r;
        }, {});

        return temp_array;
    }
    catch(err){
       console.log(err);
    }

}

export const groupGoogleFilesByTime = (video_array) => {
    try {
        let temp_array = video_array.reduce((r, a) => {
            let dateTime =  googleDriveFileTimestampToData(a.createdTime);
            r[dateTime] = [...r[dateTime] || [], a];
            return r;
        }, {});

        return temp_array;
    }
    catch(err){
       console.log(err);
    }

}

export const sortByTimeRecentToOldest = (video_array) => {
    const sortedArray = video_array.sort(
        (objA, objB) => objB.creationTime - objA.creationTime,
    );
    return sortedArray
}

export const sortByTimeOldestToRecent = (video_array) => {
    const sortedArray = video_array.sort(
        (objA, objB) => objA.creationTime - objB.creationTime,
    );
    return sortedArray
}

export const sortByLengthShortToLong = (video_array) => {
    const sortedArray = video_array.sort(
        (objA, objB) => objA.duration - objB.duration,
    );
    return sortedArray
}

export const sortByLengthLongToShort = (video_array) => {
    const sortedArray = video_array.sort(
        (objA, objB) => objB.duration - objA.duration,
    );
    return sortedArray
}


