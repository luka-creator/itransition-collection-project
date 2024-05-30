import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate('/');
    } catch (error) {
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="email">{t('email')}</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t('password')}</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">{t('register')}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
