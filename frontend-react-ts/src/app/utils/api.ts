import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/';

export default axios.create({
  baseURL: BACKEND_URL,
  responseType: 'json'
});
