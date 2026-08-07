/**
 * Centralised runtime configuration.
 * Values come from Vite environment variables (see .env.example);
 * only VITE_-prefixed variables are exposed to the client bundle.
 */

/** Base URL of the Domus REST API. */
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

/** Base URL of the Photon (OpenStreetMap) geocoder. Free, no key required. */
export const PHOTON_URL = 'https://photon.komoot.io/api';
