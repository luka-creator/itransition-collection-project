import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';

const Header = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.remove('bg-dark', 'text-light');
      document.body.classList.add('bg-light', 'text-dark');
    } else {
      document.body.classList.remove('bg-light', 'text-dark');
      document.body.classList.add('bg-dark', 'text-light');
    }
  };

  return (
    <Navbar expand="lg" className={isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}>
      <Container>
        <Navbar.Brand as={Link} to="/">{t('home')}</Navbar.Brand>
        <Link to="/create-ticket">Create support ticket</Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/search">{t('search')}</Nav.Link>
            {user && <Nav.Link as={Link} to="/user">{t('user')}</Nav.Link>}
            {user && user.isAdmin && <Nav.Link as={Link} to="/admin">{t('admin')}</Nav.Link>}
          </Nav>
          <Nav>
              <NavDropdown title={t('language')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => changeLanguage('en')}>English</NavDropdown.Item>
                <NavDropdown.Item onClick={() => changeLanguage('es')}>Español</NavDropdown.Item>
              </NavDropdown>
              <div className="d-flex">
                {user ? (
                  <Button variant={isDarkMode ? 'outline-light' : 'outline-danger'} onClick={logout} className="me-2">{t('logout')}</Button>
                ) : (
                  <>
                    <Button as={Link} to="/login" variant={isDarkMode ? 'outline-light' : 'outline-primary'} className="me-2">{t('login')}</Button>
                    <Button as={Link} to="/register" variant={isDarkMode ? 'outline-light' : 'outline-success'} className="me-2">{t('register')}</Button>
                  </>
                )}
                <Button variant={isDarkMode ? 'outline-light' : 'outline-secondary'} onClick={toggleDarkMode}>
                  {t('darkMode')}
                </Button>
              </div>
           </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
