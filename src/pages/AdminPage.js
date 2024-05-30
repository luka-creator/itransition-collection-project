import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UserManagement from '../components/Admin/UserManagement';
import { useTranslation } from 'react-i18next';

const AdminPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className={`container pb-5 ${document.body.classList.contains('bg-dark') ? 'text-light' : 'text-dark'}`}>
      <h1>{t('adminPage')}</h1>
      <UserManagement />
    </div>
  );
};

export default AdminPage;
