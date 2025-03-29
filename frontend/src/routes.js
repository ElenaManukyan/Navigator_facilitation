// const apiPath = 'api';
const authPath = 'auth';

const routes = {
  main: () => '/',
  login: () => `/${authPath}/login`,
  signup: () => `/${authPath}/register`,
};

export default routes;