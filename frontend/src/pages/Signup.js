import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, Button, Alert, Container, Row, Col, Card,
} from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
// import { useRollbar } from '@rollbar/react';
// import { showNotification } from '../DefaulltComponents/NotificationComponent';
import './Signup.css';
import {
  signup, clearAuthError, getAuthStatus, getAuthError,
} from '../features/authSlice';
import routes from '../routes';

const Signup = () => {
  const { Formik } = formik;
  const { t } = useTranslation();
  // const rollbar = useRollbar();

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required(`${t('errors.validation.required')}`)
      .min(3, `${t('errors.validation.usernameMinMaxLength')}`)
      .max(20, `${t('errors.validation.usernameMinMaxLength')}`),

    password: yup
      .string()
      .required(`${t('errors.validation.required')}`)
      .min(6, `${t('errors.validation.passwdMinLength')}`),

    confirmPassword: yup
      .string()
      .required(`${t('errors.validation.required')}`)
      .oneOf([yup.ref('password'), null], `${t('errors.validation.confirmPasswdConfirm')}`),
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector(getAuthStatus);
  const signupError = useSelector(getAuthError);

  useEffect(() => {
    if (signupError) {
      // showNotification(`${signupError}`, 'error');
      dispatch(clearAuthError());
    }
  }, [signupError, dispatch]);

  const handleSubmitClick = async (values) => {
    dispatch(signup({ username: values.username, password: values.password }))
      .unwrap()
      .then(() => {
        navigate(routes.main());
      })
      .catch((err) => {
        console.log(`err= ${JSON.stringify(err, null, 2)}`);
        // rollbar.error('Ошибка при регистрации:', error);
        if (Number(err.slice(-3)) === 409) {
          setError(`${t('errors.signupUserUnique')}`);
        } else {
          setError(err);
        }
      });
  };

  const handleClickLogin = () => {
    navigate(routes.login());
  };

  return (
    <Container className="mt-5">
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col md={8} lg={6} xs={12}>
          <Card className="shadow" style={{ padding: '5px' }}>
            <Card.Body>
              <h1 className="text-center" style={{ marginBottom: '20px' }}>
                {t('login.signup')}
              </h1>
              {status === 'failed' && error && <Alert variant="danger">{error}</Alert>}
              <Formik
                validationSchema={validationSchema}
                onSubmit={handleSubmitClick}
                initialValues={{
                  username: '',
                  password: '',
                  confirmPassword: '',
                }}
              >
                {({
                  handleSubmit, handleChange, values, errors,
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername" className="position-relative mb-4">
                      <Form.Control
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        placeholder=" "
                        isInvalid={!!errors.username}
                        style={{
                          height: '55px',
                        }}
                      />
                      <Form.Label className="placeholder1">{t('signup.username')}</Form.Label>
                      <Form.Control.Feedback type="invalid" className="position-absolute" style={{ top: '100%', margin: 0 }}>
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formPassword" className="position-relative mb-4">
                      <Form.Control type="password" name="password" value={values.password} onChange={handleChange} placeholder=" " isInvalid={!!errors.password} style={{ height: '55px' }} />
                      <Form.Label className="placeholder1">{t('login.password')}</Form.Label>
                      <Form.Control.Feedback type="invalid" className="position-absolute" style={{ top: '100%', margin: 0 }}>
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formConfirmPassword" className="position-relative">
                      <Form.Control
                        value={values.confirmPassword}
                        type="password"
                        name="confirmPassword"
                        placeholder=" "
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        style={{ height: '55px' }}
                      />
                      <Form.Label className="placeholder1">{t('signup.confirmPasswd')}</Form.Label>
                      <Form.Control.Feedback type="invalid" className="position-absolute" style={{ top: '100%', margin: 0 }}>
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-grid">
                      <Button variant="primary" type="submit" className="mt-4" style={{ height: '50px' }}>
                        {t('signup.signup')}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
            <Card.Footer className="text-center">
              Есть аккаунт?
              <span style={{ marginLeft: '8px' }}>
                <Card.Link onClick={handleClickLogin} style={{ cursor: 'pointer' }}>
                  {t('signup.input')}
                </Card.Link>
              </span>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;