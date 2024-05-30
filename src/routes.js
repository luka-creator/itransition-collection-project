import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import CollectionPage from './pages/CollectionPage';
import ItemPage from './pages/ItemPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage'; 
import NotFoundPage from './pages/NotFoundPage';

const routes = [
  { path: '/', component: Home, exact: true },
  { path: '/admin', component: AdminPage },
  { path: '/collections/:id', component: CollectionPage },
  { path: '/items/:id', component: ItemPage },
  { path: '/user', component: UserPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/search', component: SearchPage }, 
  { path: '*', component: NotFoundPage } 
];

export default routes;
