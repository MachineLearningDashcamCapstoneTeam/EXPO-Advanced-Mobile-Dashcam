
//! Use the property (creationTime)
export const sortByTimeRecentToOldest = (video_array) => {
    const sortedArray = video_array.sort(
        (objA, objB) => objA.creationTime - objB.creationTime,
    );
    return sortedArray
}

export const sortByTimeOldestToRecent = (video_array) => {

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


//! File size does not exist in the object. I recommend deleting this function
export const sortBySizeSmallToBig = (video_array) => {

}
export const sortBySizeBigToSmall = (video_array) => {

}