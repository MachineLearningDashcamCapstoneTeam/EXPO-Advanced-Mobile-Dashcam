
export const groupByTime = (video_array) =>{
    let temp_array =  new Array(Object.values(video_array));

    temp_array = temp_array.reduce((r, a) => {
        r[a.creationTime] = [...r[a.creationTime] || [], a];
        return r;
       }, {});
    return temp_array;
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


