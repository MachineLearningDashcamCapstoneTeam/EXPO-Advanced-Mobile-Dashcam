/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { getObjectsWhereKeyEqualsValue } from '../utils/filter-data';
import { GOOGLE_FOLDER_URL, GOOGLE_QUERY_URL, GOOGLE_FILE_URL, GOOGLE_UPLOAD_URL } from '../constants';
import { Buffer } from "buffer";
import { timestampToDateTimeString } from '../utils/fetch-time';
import { CONSTANTS } from '@firebase/util';

export const getGoogleDriveFolders = async (accessToken) => {
    try {
        const promise = await axios.get(GOOGLE_FOLDER_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return promise;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        } if (error.request) {
            return error.request;
        }
        return error.message;
    }
};

export const getGoogleDriveFiles = async (accessToken, folderId) => {
    try {
        const customUrl = `${GOOGLE_QUERY_URL}'${folderId}'+in+parents&trashed=false&fields=files(*)`;
        const promise = await axios.get(customUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return promise;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        } if (error.request) {
            return error.request;
        }
        return error.message;
    }
};

//* Using the access token and file url, delete the file
export const deleteGoogleDriveFile = async (accessToken, fileId) => {
    try {
        const customUrl = `${GOOGLE_FILE_URL}${fileId}`;
        const promise = await axios.delete(customUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return promise;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        } if (error.request) {
            return error.request;
        }
        return error.message;
    }
};


export const uploadGoogleDriveGeojsonFilePost = async (accessToken, metadata) => {
    try {
        const customUrl = `${GOOGLE_UPLOAD_URL}`;
        const promise = await axios({
            method: "POST",
            url: customUrl,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            data: JSON.stringify(metadata),
        })

        return promise;

    } catch (error) {
        if (error.response) {
            return error.response.status;
        } if (error.request) {
            return error.request;
        }
        return error.message;
    }
}


export const uploadGoogleDriveGeojsonFilePut = async (accessToken, geojson, location) => {
    try {
        const data = Buffer.from(geojson);
        const fileSize = data.length;
        const promise = await axios({
            method: "PUT",
            url: location,
            headers: { 
                Authorization: `Bearer ${accessToken}`, 
                "Content-Length": `bytes ${fileSize}` },
            data: data,
        });

        return promise;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        } if (error.request) {
            return error.request;
        }
        return error.message;
    }
}

export const uploadGoogleDriveVideoFilePost = async (accessToken, metadata) =>{
    try {
   
        const promise = await axios({
            method: "POST",
            url: GOOGLE_UPLOAD_URL,
            headers: { 
                Authorization: `Bearer ${accessToken}`, 
                "Content-Type": "application/json",
            },
            data: JSON.stringify(metadata),
        });

        return promise;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        } if (error.request) {
            return error.request;
        }
        return error.message;
    }
}


export const simpleUpload = async (accessToken, videoAssetData, fileSize) =>{
    try {

        const promise = await axios({
            method: "POST",
            url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'video/mp4',
                "Content-Length": `bytes ${fileSize}`,
            },
            data: videoAssetData,
        })

        return promise;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        } if (error.request) {
            return error.request;
        }
        return error.message;
    }
}


export const uploadGoogleDriveVideoFilePut = async (accessToken, videoAssetData, fileSize, location) => {
    try {

        const promise = await axios({
            method: "PUT",
            url: location,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'video/mp4',
                "Content-Length": `bytes ${fileSize}`,
            },
            data: videoAssetData,
        })

        return promise;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        } if (error.request) {
            return error.request;
        }
        return error.message;
    }
}

export const uploadDashcamVideos = async (accessToken, videoAsset, videoAssetData, fileSize, geojson) => {
    try {
        const response = await getGoogleDriveFolders(accessToken);
        if (response.status === 200) {
            const cameraFolders = getObjectsWhereKeyEqualsValue(response.data.files, 'name', 'Dashcam');
           
            if (cameraFolders && cameraFolders.length >= 1) {

                // const res = await simpleUpload(accessToken, videoAssetData, fileSize)

                // let videoMetaData = {
                //     'name': `${timestampToDateTimeString(videoAsset.creationTime)}.mp4`, // Filename at Google Drive
                //     'mimeType': 'video/mp4', // mimeType at Google Drive
                //     'parents': [`${cameraFolders[0].id}`], // Folder ID at Google Drive
                // };
                // const uploadResponseVideoPost = await uploadGoogleDriveVideoFilePost(accessToken, videoMetaData);
              
                // if(uploadResponseVideoPost.status === 200){
                //     console.log('test test test')
                //     const uploadResponseVideoPut = await uploadGoogleDriveVideoFilePut(accessToken,videoAssetData, fileSize, uploadResponseVideoPost.request.responseHeaders.location)
                //     console.log(uploadResponseVideoPut)
                // }

                let metadata = {
                    'name': `${timestampToDateTimeString(videoAsset.creationTime)}.geojson`, // Filename at Google Drive
                    'mimeType': 'text/json', // mimeType at Google Drive
                    'parents': [`${cameraFolders[0].id}`], // Folder ID at Google Drive
                };
                const uploadResponseGeojsonPost = await uploadGoogleDriveGeojsonFilePost(accessToken, metadata);
                if(uploadResponseGeojsonPost.status === 200){
                    const uploadResponsePut = await uploadGoogleDriveGeojsonFilePut(accessToken, geojson, uploadResponseGeojsonPost.request.responseHeaders.location)
                    return uploadResponsePut;
                }
                else{
                    throw 'Unable to create file to store GPS Data'
                }
              
            }
            else {
                throw 'Dashcam folder not found in Google Drive'
            }
        }
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}


export const getDashcamVideos = async (accessToken) => {
    try {
        const response = await getGoogleDriveFolders(accessToken);
        if (response.status === 200) {
            const cameraFolders = getObjectsWhereKeyEqualsValue(response.data.files, 'name', 'Dashcam');
            if (cameraFolders && cameraFolders.length >= 1) {
                const documentsResponse = await getGoogleDriveFiles(accessToken, cameraFolders[0].id);
                return documentsResponse;
            }
            else {
                throw 'Dashcam folder not found in Google Drive'
            }
        }
        return response;
    } catch (error) {
        return error;
    }
};

export default getGoogleDriveFiles;
