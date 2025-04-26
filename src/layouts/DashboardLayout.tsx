import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

// Import icons
import homeIcon from '../assets/images/home1.svg';
import courseIcon from '../assets/images/course1.svg';
import settingsIcon from '../assets/images/setting1.svg';
import { authService } from '../services/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  userRole?: 'student' | 'teacher' | 'parent' | 'admin';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, userRole = 'student' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Get user data from local storage
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/auth/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Role-specific sidebar navigation items
  const getNavItems = () => {
    const commonItems = [
      { name: 'Dashboard', path: `/dashboard/${userRole}`, icon: homeIcon },
      { name: 'Profile', path: '/profile', icon: settingsIcon }
    ];

    const roleSpecificItems = {
      student: [
        { name: 'My Courses', path: '/dashboard/student/courses', icon: courseIcon },
        { name: 'Progress', path: '/dashboard/student/progress', icon: courseIcon }
      ],
      teacher: [
        { name: 'My Courses', path: '/dashboard/teacher/courses', icon: courseIcon },
        { name: 'Create Course', path: '/dashboard/teacher/create-course', icon: courseIcon },
        { name: 'Students', path: '/dashboard/teacher/students', icon: courseIcon },
        { name: 'Shop', path: '/dashboard/marketplace', icon: courseIcon }
      ],
      parent: [
        { name: 'Children', path: '/dashboard/parent/children', icon: courseIcon },
        { name: 'Progress Tracking', path: '/dashboard/parent/tracking', icon: courseIcon },
        { name: 'Services', path: '/dashboard/parent/services', icon: courseIcon }
      ],
      admin: [
        { name: 'Users', path: '/dashboard/admin/users', icon: courseIcon },
        { name: 'Courses', path: '/dashboard/admin/all-courses', icon: courseIcon },
        { name: 'Settings', path: '/dashboard/admin/settings', icon: settingsIcon }
      ]
    };

    return [...commonItems, ...roleSpecificItems[userRole]];
  };

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <Link to="/" className="brand-link">
              <span className="brand-name">WAIEDU</span>
            </Link>
          </div>
          <button onClick={toggleSidebar} className="sidebar-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
          </button>
        </div>
        
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {getNavItems().map((item, index) => (
            <Link key={index} to={item.path} className="sidebar-nav-item">
              <img src={item.icon} alt={item.name} className="nav-icon" />
              <span className="nav-label">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">{title}</h1>
          <div className="header-actions">
            <div className="notifications">
              <button className="notification-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="notification-badge">3</span>
              </button>
            </div>
            <div className="user-menu">
              <div className="user-avatar-small">{user?.name?.charAt(0) || 'U'}</div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;