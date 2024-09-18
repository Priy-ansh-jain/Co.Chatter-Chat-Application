import { HOST } from "@/utils/constant";
import axios from "axios";

const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
});

export default apiClient;
