import * as SecureStore from 'expo-secure-store';

// Use the host computer's Wi-Fi IP address instead of 10.0.2.2 
// because you are testing on a physical Xiaomi device, not an emulator!
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.4:3001';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = await SecureStore.getItemAsync('access_token');
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || JSON.stringify(errorData.errors) || 'An error occurred';
    } catch {
      // Ignored
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
