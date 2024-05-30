import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserCollections from '../components/User/UserCollections';
import { useTranslation } from 'react-i18next';

const UserPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mt-5 pb-5">
      <h1 className="mb-4">{t('userProfile', { email: user.email })}</h1>
      <UserCollections />
    </div>
  );
};

export default UserPage;