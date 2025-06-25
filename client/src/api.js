// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/users', // ✅ This must match your Express route mount
});

export default API;
