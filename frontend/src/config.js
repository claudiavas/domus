/**
 * Centralised runtime configuration.
 * Values come from Vite environment variables (see .env.example);
 * only VITE_-prefixed variables are exposed to the client bundle.
 */

/** Base URL of the Domus REST API. */
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

/** API key for the Spanish geographic data service (geoapi.es). */
export const GEOAPI_KEY = import.meta.env.VITE_GEOAPI_KEY || '';

/** Base URL for geoapi.es requests. */
export const GEOAPI_URL = 'https://apiv1.geoapi.es';
