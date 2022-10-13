export const sortByTimeRecentToOldest =(video_array) =>{

}

export const sortByTimeOldestToRecent =(video_array) =>{

}

export const sortByLengthShortToLong =(video_array) =>{
    const sortedArray = video_array.sort(
        (objA, objB)=>objA.duration - objB.duration,
    );
return sortedArray
}

export const sortByLengthLongToShort =(video_array) =>{

}

export const sortBySizeSmallToBig =(video_array) =>{

}
export const sortBySizeBigToSmall =(video_array) =>{

}