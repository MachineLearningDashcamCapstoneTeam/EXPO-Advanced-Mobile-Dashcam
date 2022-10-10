import { GOOGLE_USER_INFO_URL } from '../constants';

export const getGoogleUserInfo = async () => {
    const response = await fetch(GOOGLE_USER_INFO_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    return response.json();
  };