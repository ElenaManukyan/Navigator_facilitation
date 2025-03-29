import axios from "axios";

// const apiPath = 'api';
const authPath = 'auth';
const baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const routes = {
  main: () => `${baseURL}/`,
  login: () => `${baseURL}/${authPath}/login`,
  signup: () => `${baseURL}/${authPath}/register`,
};

export default routes;