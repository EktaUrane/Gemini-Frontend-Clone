import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChatroomPage from './pages/ChatroomPage';
import { useAuthStore } from './store/authStore';
import DarkModeToggle from './components/common/DarkModeToggle';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Redirect to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <DarkModeToggle />
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route
          path="/dashboard"
          render={() => (
            <PrivateRoute>
              {/* DashboardPage is a JSX.Element, so it matches children: JSX.Element */}
              <DashboardPage />
            </PrivateRoute>
          )}
        />
        <Route
          path="/chatroom/:id"
          render={() => (
            <PrivateRoute>
              {/* ChatroomPage is a JSX.Element, so it matches children: JSX.Element */}
              <ChatroomPage />
            </PrivateRoute>
          )}
        />
        <Redirect from="*" to="/login" />
      </Switch>
    </div>
  );
}

export default App;