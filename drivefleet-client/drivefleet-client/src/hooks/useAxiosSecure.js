import axios from 'axios';
import { API_BASE_URL } from '../lib/api';

const axiosSecure = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosSecure;
