import axios from 'axios';

const token = localStorage.getItem('token');

const instance = axios.create({
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  },
});

export default instance;
