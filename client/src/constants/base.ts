const Environment = {
  SERVER_BASE_URL: import.meta.env.VITE_SERVER_BASE_URL,
  FHIR_CLIENT_ID: import.meta.env.VITE_FHIR_CLIENT_ID,
  API: {
    CATALOG_INFO: '/api/agility/emrorderingapi/api/GetCatalogInfo',
    SUBMIT_ORDER: '/api/agility/emrorderingapi/api/SubmitOrder',
    LOGIN: '/api/common/userAuthentication',
  },
  STORAGE: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
  }
};

export default Environment;