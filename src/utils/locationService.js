// Location-based language detection service
// Detects user's country and returns appropriate language code

const COUNTRY_LANGUAGE_MAP = {
  // Armenia - Armenian
  'AM': 'hy',
  
  // Russia and Kazakhstan - Russian
  'RU': 'ru',
  'KZ': 'ru',
  
  // All other countries - English (default)
  'DEFAULT': 'en'
};

// List of countries that should default to Russian
const RUSSIAN_SPEAKING_COUNTRIES = ['RU', 'KZ'];

// List of countries that should default to Armenian
const ARMENIAN_SPEAKING_COUNTRIES = ['AM'];

/**
 * Detects user's country using IP geolocation API
 * @returns {Promise<string>} Country code (e.g., 'AM', 'RU', 'KZ', 'US')
 */
export const detectUserCountry = async () => {
  try {
    // Using ipapi.co as a free, reliable geolocation service
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.country_code || 'DEFAULT';
  } catch (error) {
    // Fallback to browser language detection
    return detectLanguageFromBrowser();
  }
};

/**
 * Fallback method to detect language from browser settings
 * @returns {string} Country code based on browser language
 */
const detectLanguageFromBrowser = () => {
  if (typeof navigator === 'undefined') {
    return 'DEFAULT'; // Server-side fallback
  }
  
  const browserLang = navigator.language || navigator.userLanguage;
  
  // Check for Armenian
  if (browserLang.startsWith('hy') || browserLang.startsWith('am')) {
    return 'AM';
  }
  
  // Check for Russian
  if (browserLang.startsWith('ru')) {
    return 'RU';
  }
  
  // Default to English
  return 'DEFAULT';
};

/**
 * Gets the appropriate language code based on country
 * @param {string} countryCode - Two-letter country code
 * @returns {string} Language code ('hy', 'ru', or 'en')
 */
export const getLanguageFromCountry = (countryCode) => {
  if (ARMENIAN_SPEAKING_COUNTRIES.includes(countryCode)) {
    return 'hy';
  }
  
  if (RUSSIAN_SPEAKING_COUNTRIES.includes(countryCode)) {
    return 'ru';
  }
  
  return 'en'; // Default to English for all other countries
};

/**
 * Main function to detect and return the appropriate language
 * @returns {Promise<string>} Language code ('hy', 'ru', or 'en')
 */
export const detectUserLanguage = async () => {
  try {
    const countryCode = await detectUserCountry();
    return getLanguageFromCountry(countryCode);
  } catch (error) {
    return 'en';
  }
};

/**
 * Checks if location detection is supported in the current environment
 * @returns {boolean} True if location detection is available
 */
export const isLocationDetectionSupported = () => {
  return typeof window !== 'undefined' && typeof fetch !== 'undefined';
};
