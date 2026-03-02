export const API_CONFIG = {
  // For development, use direct backend URL
  // For production, update to your actual backend URL
  BASE_URL: 'http://localhost:8800', // Direct backend URL for development
  VERSION: 'v1',
  
  ENDPOINTS: {
    // User endpoints
    UPDATE_USER: (userId: string) => `${API_CONFIG.BASE_URL}/api/v1/users/${userId}`,
    GET_USER: (userId: string) => `${API_CONFIG.BASE_URL}/api/v1/users/${userId}`,
    UPLOAD_PROFILE_IMAGE: (userId: string) => `${API_CONFIG.BASE_URL}/api/v1/users/${userId}/profile-image`,
    
    // Alternative endpoints (uncomment and modify based on your backend)
    // UPDATE_USER: (userId: string) => `${API_CONFIG.BASE_URL}/api/users/${userId}`,
    // UPDATE_USER: (userId: string) => `${API_CONFIG.BASE_URL}/user/profile/${userId}`,
    // UPDATE_USER: (userId: string) => `${API_CONFIG.BASE_URL}/auth/update-profile/${userId}`,
  }
};

// Helper function to get the correct endpoint
export function getUpdateUserEndpoint(userId: string): string {
  // Use the configured endpoint
  return API_CONFIG.ENDPOINTS.UPDATE_USER(userId);
}
