// Single place for the backend URL. Override with VITE_API_URL in .env.local.
export const API_URL = import.meta.env.VITE_API_URL || 'https://yogic-server.onrender.com';

// Used by router loaders (they run outside React hooks, so they read the token directly).
export const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};
