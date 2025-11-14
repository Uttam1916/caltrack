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
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    // Enable dark mode
    document.documentElement.classList.add('dark');
    
    // Check if user is already logged in (from localStorage)
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      const u = localStorage.getItem('user');
      setCurrentUser(u ? JSON.parse(u) : null);
    }
  }, []);

  const handleLogin = (user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
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
  {currentPage === 'dashboard' && <Dashboard currentUser={currentUser} />}
  {currentPage === 'community' && <Community currentUser={currentUser} />}
        {currentPage === 'settings' && <Settings />}
      </main>
    </div>
  );
}
