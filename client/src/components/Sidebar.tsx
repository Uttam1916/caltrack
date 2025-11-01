import { Home, Users, Settings, LogOut } from 'lucide-react';
import '../styles/sidebar.css';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'community' | 'settings') => void;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>CalorieTracker</h2>
      </div>

      <nav className="sidebar-nav">
        <button
          className={currentPage === 'dashboard' ? 'active' : ''}
          onClick={() => onNavigate('dashboard')}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </button>

        <button
          className={currentPage === 'community' ? 'active' : ''}
          onClick={() => onNavigate('community')}
        >
          <Users size={20} />
          <span>Community</span>
        </button>

        <button
          className={currentPage === 'settings' ? 'active' : ''}
          onClick={() => onNavigate('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
