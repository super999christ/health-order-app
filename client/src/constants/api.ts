import axios from "axios";
import Environment from "./base";

export const apiClient = axios.create({
  baseURL: Environment.SERVER_BASE_URL
});