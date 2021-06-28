// Core
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Contexts
import { AuthContextProvider } from './contexts/AuthContext';

// Pages
import { Home } from './pages/Home';
import { Room } from './pages/Room';
import { NewRoom } from './pages/NewRoom';
import { AdminRoom } from './pages/AdminRoom';

const routesList = [
  {
    path: '/',
    isExact: true,
    component: Home
  },
  {
    path: '/rooms/new',
    isExact: false,
    component: NewRoom
  },
  {
    path: '/rooms/:id',
    isExact: false,
    component: Room
  },
  {
    path: '/admin/rooms/:id',
    isExact: false,
    component: AdminRoom
  },
]

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          {routesList.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.isExact}
              component={route.component}
            />
          ))}
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
