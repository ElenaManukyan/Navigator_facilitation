import React, { useEffect } from 'react';
import {
  Routes, Route, Navigate, unstable_HistoryRouter as HistoryRouter
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import Login from './pages/Login';
// import NotFound from './Pages/NotFound';
// import Signup from './Pages/Signup';
import NavbarComponent from './components/Navbar';
import { setAuthorized, getToken } from './features/authSlice';
import routes from './routes';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import { setTheme } from './features/themeSlice';

// Создаю кастомный history
const customHistory = createBrowserHistory();

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const theme = useSelector((state) => state.theme.theme);

  // localStorage.removeItem('token');
  console.log(`token= ${token}`);

  // Проверяю токен
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(setAuthorized(true));
    } else {
      dispatch(setAuthorized(false));
    }
  }, [dispatch, token]);

  // Проверяю тему
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      dispatch(setTheme(storedTheme));
    }
  }, [dispatch]);

  return (
    <div
      className={`bg-${theme} text-${theme === 'light' ? 'dark' : 'light'} min-vh-100`}
    >
      <HistoryRouter 
        history={customHistory}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <NavbarComponent />
        <Routes>
          <Route
            path={routes.main()}
            element={token ? <h1>Токен есть!</h1> : <Navigate to={routes.login()} replace />}
          />
          <Route path={routes.login()} element={<Login />} />
          <Route path={routes.signup()} element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HistoryRouter>
    </div>
  );
};

export default App;
