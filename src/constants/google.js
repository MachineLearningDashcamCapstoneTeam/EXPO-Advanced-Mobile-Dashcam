export const GOOGLE_CONFIG = {
    androidClientId: "104089541669-1poiqajokkb66c0io7255e77jelvn6kb.apps.googleusercontent.com",
    iosClientId: "104089541669-7jd8m55cq4t48sqd38rhfmhvivm3i0cq.apps.googleusercontent.com",
    expoClientId: '104089541669-1ip74lriitnk0sobrebpd39mf5l3g9qm.apps.googleusercontent.com',
    scopes: ['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'],
}

// Google Login System
export const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

// Google Drive
export const GOOGLE_BASE_URL = 'https://www.googleapis.com/drive/v3';
export const GOOGLE_FOLDER_URL = `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder'`;
export const GOOGLE_QUERY_URL = 'https://www.googleapis.com/drive/v3/files?q=';
export const GOOGLE_FILE_URL = 'https://www.googleapis.com/drive/v3/files/';
export const GOOGLE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable'

// Machine Learning
export const MACHINE_LEARNING_BASE_URL = 'http://127.0.0.1:8000';
export const MACHINE_LEARNING_PROCESS_URL = 'http://127.0.0.1:8000/process';
