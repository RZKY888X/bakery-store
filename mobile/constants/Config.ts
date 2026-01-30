import { Platform } from 'react-native';

const localhost = Platform.OS === 'android' ? '10.0.2.2' : '192.168.18.40';

// Replace with your computer's IP address (check via ipconfig/ifconfig)
export const API_URL = 'http://192.168.18.40:4000/api';
export const UPLOAD_URL = 'http://192.168.18.40:4000';

export const fixImageUrl = (url: string | null | undefined) => {
  if (!url) return 'https://via.placeholder.com/150';
  
  // If it's a localhost URL from backend, replace with our ID
  if (url.includes('localhost:4000')) {
    return url.replace('localhost:4000', '192.168.18.40:4000');
  }
  
  // If it's a relative path, prepend UPLOAD_URL
  if (url.startsWith('/')) {
    return `${UPLOAD_URL}${url}`;
  }
  
  return url;
};
