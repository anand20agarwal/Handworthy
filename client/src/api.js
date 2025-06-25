// api.js
import axios from 'axios';

const API = axios.create({
//   baseURL: 'http://localhost:5000/api/users', 
baseURL: 'https://handworthy-1.onrender.com', 
});

export default API;
