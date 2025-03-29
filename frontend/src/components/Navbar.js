import { Container, Button, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setAuthorized, getIsAuthorized } from '../features/authSlice';
import routes from '../routes';
import ThemeToggle from './ThemeToggle';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthorized = useSelector(getIsAuthorized);
  const token = localStorage.getItem('token');
  const { t } = useTranslation();
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    if (token) {
      dispatch(setAuthorized(true));
    } else {
      dispatch(setAuthorized(false));
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    // Логика выхода из системы
    dispatch(setAuthorized(false));
    localStorage.clear(); // Remove all data
    navigate(routes.login());
  };

  const handleBrandClick = () => {
    if (token) {
      navigate(routes.main());
    } else {
      navigate(routes.login());
    }
  };

  return (
    <Navbar expand="lg" className={`bg-${theme === 'light' ? 'light' : 'dark'}`} data-bs-theme={theme} style={{ boxShadow: '0 1px 5px rgba(0, 0, 0, 0.3)' }}>
      <Container
        fluid
        style={{ margin: 0 }}
      >
        <Navbar.Brand onClick={handleBrandClick} style={{ cursor: 'pointer', color: 'gray' }}>
        {t('navbar.logo')}
        </Navbar.Brand>

        <div className="d-flex align-items-center">
        <ThemeToggle />
        {isAuthorized ? (
            <Button variant={theme} onClick={handleLogout} style={{ color: 'gray' }}>
            {t('navbar.logout')}
            </Button>
        ) : null}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
