const Environment = {
  SERVER_BASE_URL: import.meta.env.VITE_SERVER_BASE_URL,
  FHIR_CLIENT_ID: import.meta.env.VITE_FHIR_CLIENT_ID,
  EPIC_ID_NUMBER: import.meta.env.VITE_EPIC_ID_NUMBER,
  API: {
    CATALOG_INFO: '/api/agility/emrorderingapi/api/GetCatalogInfo',
    SUBMIT_ORDER: '/api/agility/emrorderingapi/api/SubmitOrder',
    CANCEL_ORDER: '/api/agility/emrorderingapi/api/cancelorder',
    DISCHARGE_PATIENT: '/api/agility/emrorderingapi/api/dischargepatient',
    GET_ORDERS_BY_PATIENT: '/api/agility/emrorderingapi/api/GetOrdersByPatient',
    GET_LATEST_ORDER_BY_PATIENT: '/api/common/GetLatestOrderByPatient',
    LOGIN: '/api/common/login',
    ROTATE_TOKEN: '/api/common/token-refresh',
    CREATE_RESERVATION: '/api/agility/reservationapi/scheduler/api/newreservations',
    GET_RESERVATIONS: '/api/agility/reservationapi/scheduler/api/getreservations',
  },
  STORAGE: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
  }
};

export default Environment;