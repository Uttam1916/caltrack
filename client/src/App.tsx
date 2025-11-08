import { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { Community } from './components/Community';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';
import './styles/app.css';

type Page = 'dashboard' | 'community' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    // Enable dark mode
    document.documentElement.classList.add('dark');
    
    // Check if user is already logged in (from localStorage)
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setAuthToken(localStorage.getItem('token'));
      const u = localStorage.getItem('user');
      setCurrentUser(u ? JSON.parse(u) : null);
    }
  }, []);

  const handleLogin = (user: any, token: string) => {
    setIsAuthenticated(true);
    setAuthToken(token);
    setCurrentUser(user);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'community' && <Community token={authToken} currentUser={currentUser} />}
        {currentPage === 'settings' && <Settings />}
      </main>
    </div>
  );
}
