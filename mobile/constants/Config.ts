import { Platform } from 'react-native';

// Get the correct localhost address based on Platform
// Android Emulator: 10.0.2.2
// iOS Simulator: localhost
// Physical Device: Change this to your computer's LAN IP (e.g., 192.168.1.X)
const DEV_IP = '192.168.18.40'; // Update this for physical device testing
const PORT = '4000';

const getBaseUrl = () => {
    if (__DEV__) {
        // Check if running on Android Emulator
        // @ts-ignore
        const isHermes = !!global.HermesInternal;
        
        if (Platform.OS === 'android') {
             // If on Emulator, usually 10.0.2.2 points to host localhost
             // But if we want to force LAN IP, we can use DEV_IP
             // Standard Android Emulator: 10.0.2.2
             return `http://10.0.2.2:${PORT}`;
        } else {
            // iOS or Web
            return `http://localhost:${PORT}`;
        }
    }
    // Production URL (if any)
    return `http://${DEV_IP}:${PORT}`;
};

// Use this for Physical Device debugging if needed
// export const API_URL = `http://${DEV_IP}:${PORT}/api`;
// export const UPLOAD_URL = `http://${DEV_IP}:${PORT}`;

// Use this for Emulator debugging
export const API_URL = `${getBaseUrl()}/api`;
export const UPLOAD_URL = `${getBaseUrl()}`;

export const fixImageUrl = (url: string | null | undefined) => {
  if (!url) return 'https://via.placeholder.com/150';
  
  // If it's a localhost URL from backend, replace the origin with our correct UPLOAD_URL origin
  if (url.includes('localhost:4000') || url.includes('127.0.0.1:4000')) {
    const relativePath = url.split('4000')[1];
    return `${UPLOAD_URL}${relativePath}`;
  }

  if (url.startsWith('http')) return url;

  // If it's a relative path, prepend UPLOAD_URL
  if (url.startsWith('/')) {
    return `${UPLOAD_URL}${url}`;
  }
  
  return `${UPLOAD_URL}/${url}`;
};

export const checkConnection = async () => {
    try {
        console.log(`Checking connection to: ${API_URL}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const res = await fetch(`${API_URL.replace('/api', '')}`, { 
            method: 'GET',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        return res.ok;
    } catch (error) {
        console.error("Connection check failed:", error);
        return false;
    }
};
