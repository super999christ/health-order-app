const Environment = {
  SERVER_BASE_URL: import.meta.env.VITE_SERVER_BASE_URL,
  API: {
    CATALOG_INFO: '/api/agility/emrorderingapi/api/GetCatalogInfo',
    SUBMIT_ORDER: '/api/agility/emrorderingapi/api/SubmitOrder',
  }
};

export default Environment;