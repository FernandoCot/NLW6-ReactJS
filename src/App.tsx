// Core
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Contexts
import { AuthContextProvider } from './contexts/AuthContext';

// Pages
import { Home } from './pages/Home';
import { Room } from './pages/Room';
import { NewRoom } from './pages/NewRoom';
import { AdminRoom } from './pages/AdminRoom';

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route
            exact
            path="/"
            component={Home}
          />
          <Route
            path="/rooms/new"
            component={NewRoom}
          />
          <Route
            path="/rooms/:id"
            component={Room}
          />
          <Route
            path="/admin/rooms/:id"
            component={AdminRoom}
          />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
