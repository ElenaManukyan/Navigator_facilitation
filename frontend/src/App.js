import React, { useEffect } from 'react';
import {
  BrowserRouter as Router, Routes, Route, Navigate, unstable_HistoryRouter as HistoryRouter
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import Login from './pages/Login';
// import NotFound from './Pages/NotFound';
// import Signup from './Pages/Signup';
// import NavbarComponent from './DefaulltComponents/Navbar';
import { setAuthorized, getToken } from './features/authSlice';
import routes from './routes';
import Signup from './pages/Signup';

// Создаю кастомный history
const customHistory = createBrowserHistory();

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);

  // localStorage.removeItem('token');
  console.log(`token= ${token}`);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(setAuthorized(true));
    } else {
      dispatch(setAuthorized(false));
    }
  }, [dispatch, token]);

  return (
    <HistoryRouter 
      history={customHistory}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
    {/*<Router>*/}
      {/*<NavbarComponent />*/}
      <Routes>
        <Route
          path={routes.main()}
          element={token ? <h1>Токен есть!</h1> : <Navigate to={routes.login()} replace />}
        />
        <Route path={routes.login()} element={<Login />} />
        <Route path={routes.signup()} element={<Signup />} />
      </Routes>
    {/*</Router>*/}
    </HistoryRouter>
  );
};

export default App;
