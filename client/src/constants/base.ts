const Environment = {
  SERVER_BASE_URL: import.meta.env.VITE_SERVER_BASE_URL,
  FHIR_CLIENT_ID: import.meta.env.VITE_FHIR_CLIENT_ID,
  API: {
    CATALOG_INFO: '/api/agility/emrorderingapi/api/GetCatalogInfo',
    SUBMIT_ORDER: '/api/agility/emrorderingapi/api/SubmitOrder',
    GET_ORDERS: '/api/agility/emrorderingapi/api/GetOrders',
    LOGIN: '/api/common/login',
    ROTATE_TOKEN: '/api/common/token-refresh',
    CREATE_RESERVATION: '/api/agility/reservationapi/api/newReservations',
    GET_RESERVATIONS: '/api/agility/reservationapi/api/getReservations',
  },
  STORAGE: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
  }
};

export default Environment;