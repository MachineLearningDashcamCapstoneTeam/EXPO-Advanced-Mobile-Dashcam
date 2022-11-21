/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { getObjectsWhereKeyEqualsValue } from '../utils/filter-data';
import { GOOGLE_FOLDER_URL, GOOGLE_QUERY_URL, GOOGLE_FILE_URL, GOOGLE_UPLOAD_URL } from '../constants';
import { Buffer } from "buffer";
import { timestampToDateTimeString } from '../utils/fetch-time';

export const getGoogleDriveFolders = async (accessToken) => {
    try {
      const config = {
        method: 'get',
        url: GOOGLE_FOLDER_URL,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const promise = await axios(config);
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
      const config = {
        method: 'get',
        url: customUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
  
      const promise = await axios(config);
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
  
  export const verifyAndAddPermissions = async (accessToken, fileId) => {
    try {
      const url = `${GOOGLE_FILE_URL}/${fileId}/permissions`;
      const data = JSON.stringify({
        role: 'writer',
        type: 'anyone',
      });
      const config = {
        method: 'post',
        url,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data,
      };
      const promise = await axios(config);
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
  
  // Using the access token and file url, delete the file
  export const deleteGoogleDriveFile = async (accessToken, fileId) => {
    try {
      const customUrl = `${GOOGLE_FILE_URL}/${fileId}`;
      const config = {
        method: 'delete',
        url: customUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };
  
      const promise = await axios(config);
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



export const getGoogleDriveFile = async (accessToken, fileId) => {
    try {
      const customUrl = `${GOOGLE_FILE_URL}/${fileId}`;
      const config = {
        method: 'get',
        url: customUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };
      const promise = await axios(config);
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

export const createDashcamFolder = async (accessToken) => {
    try {
      const config = {
        method: 'POST',
        url: GOOGLE_FILE_URL,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          mimeType: 'application/vnd.google-apps.folder',
          name: 'Dashcam',
        }),
      };
  
      const promise = await axios(config);
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
  
  export const getDashcamVideos = async (accessToken) => {
    try {
      const response = await getGoogleDriveFolders(accessToken);
      if (response.status === 200) {
        const cameraFolder = getObjectsWhereKeyEqualsValue(response.data.files, 'name', 'Dashcam')[0];
        if (cameraFolder) {
          const documentsResponse = await getGoogleDriveFiles(accessToken, cameraFolder.id);
          return documentsResponse;
        }
        const createResponse = await createDashcamFolder(accessToken);
        if (createResponse === 200) {
          getDashcamVideos(accessToken);
        } else {
          return createResponse;
        }
      }
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  };





  

export const uploadGoogleDriveGeojsonFilePost = async (accessToken, metadata) => {
    try {
      
        return axiosUtility(config);

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
                "Content-Length": `bytes ${fileSize}`
            },
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

export const uploadGoogleDriveVideoFilePost = async (accessToken, metadata) => {
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


export const simpleUpload = async (accessToken, videoAssetData, fileSize) => {
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


                //* Prepare the Geojson File
                let metadata = {
                    'name': `${timestampToDateTimeString(videoAsset.creationTime)}.geojson`, 
                    'mimeType': 'text/json',
                    'parents': [`${cameraFolders[0].id}`],
                };

                const customUrl = `${GOOGLE_UPLOAD_URL}`;
                let config = {
                    method: 'POST',
                    url: customUrl,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(metadata),
                };
        

                const uploadResponseGeojsonPost = await axiosUtility(config);
                if (uploadResponseGeojsonPost.status === 200) {
                    const uploadResponsePut = await uploadGoogleDriveGeojsonFilePut(accessToken, geojson, uploadResponseGeojsonPost.request.responseHeaders.location)
                    return uploadResponsePut;
                }
                else {
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


export default getGoogleDriveFiles;
