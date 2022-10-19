/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { getObjectsWhereKeyEqualsValue } from '../utils/filter-data';
import { GOOGLE_FOLDER_URL, GOOGLE_QUERY_URL, GOOGLE_FILE_URL, GOOGLE_UPLOAD_URL } from '../constants';

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
            console.log(error)
            return error.response.status;
        } if (error.request) {
            console.log(error)
            return error.request;
        }
        console.log(error)
        return error.message;
    }
};

// Using the access token and file url, delete the file
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
            console.log(error)
            return error.response.status;
        } if (error.request) {
            console.log(error)
            return error.request;
        }
        console.log(error)
        return error.message;
    }
};


export const uploadGoogleDriveFile = async (accessToken, file) => {
    try {
        const customUrl = `${GOOGLE_UPLOAD_URL}`;
        const promise = await axios.post(customUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                file
            },
        });
        return promise;
        } catch (error) {
            if (error.response) {
                console.log(error)
                return error.response.status;
            } if (error.request) {
                console.log(error)
                return error.request;
            }
            console.log(error)
            return error.message;
        }
    }

export const uploadDashcamVideos = async (accessToken) => {

        const response = await getGoogleDriveFolders(accessToken);
        if (response.status === 200) {
            const cameraFolder = getObjectsWhereKeyEqualsValue(response.data.files, 'name', 'Dashcam')[0];
            let fileContent = 'sample text';
            let file = new Blob([fileContent], { type: 'text/plain' });
            let metadata = {
                'name': 'sampleName', // Filename at Google Drive
                'mimeType': 'text/plain', // mimeType at Google Drive
                'parents': [`${cameraFolder.id}`], // Folder ID at Google Drive
            };

            console.log(metadata)
            let form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);
   
            console.log(file)
            const uploadResponse = await uploadGoogleDriveFile(accessToken, form);
            return uploadResponse;

        }
    }

    export const getDashcamVideos = async (accessToken) => {
        try {
            const response = await getGoogleDriveFolders(accessToken);
            if (response.status === 200) {
                const cameraFolder = getObjectsWhereKeyEqualsValue(response.data.files, 'name', 'Dashcam')[0];
                const documentsResponse = await getGoogleDriveFiles(accessToken, cameraFolder.id);
                return documentsResponse;
            }

            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    export default getGoogleDriveFiles;
