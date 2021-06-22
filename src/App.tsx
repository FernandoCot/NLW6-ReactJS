// Core
import { BrowserRouter, Route } from 'react-router-dom';

// Contexts
import { AuthContextProvider } from './contexts/AuthContext';

// Pages
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Route
          exact
          path="/"
          component={Home}
        />
        <Route
          path="/rooms/new"
          component={NewRoom}
        />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
