import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import routes from './routes';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { useAuth } from './contexts/AuthContext';
import SearchPage from './pages/SearchPage'; // Import SearchPage

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        {routes.map((route, index) => {
          if (route.path === '/admin' && !user) {
            return <Route key={index} path={route.path} element={<Navigate to="/login" />} />;
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          );
        })}
        <Route path="/search" element={<SearchPage />} /> 
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
