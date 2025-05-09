
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutList, 
  CheckSquare, 
  Users, 
  ListChecks, 
  FileText, 
  LogOut,
  Menu
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutList className="w-4 h-4 mr-2" /> },
    { path: '/stages', label: 'Stages', icon: <ListChecks className="w-4 h-4 mr-2" /> },
    { path: '/checklists', label: 'Checklists', icon: <CheckSquare className="w-4 h-4 mr-2" /> },
    { path: '/logs', label: 'Activity Logs', icon: <FileText className="w-4 h-4 mr-2" /> },
  ];

  // Add admin-only routes
  if (user?.role === 'admin') {
    navItems.push({ 
      path: '/users', 
      label: 'Users', 
      icon: <Users className="w-4 h-4 mr-2" /> 
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top navigation bar */}
      <header className="bg-primary shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" className="md:hidden text-white" onClick={toggleMenu}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">TaskFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-white hidden md:inline-block">
               
                {user.username} ({user.role})
              </span>
              <Button variant="outline" size="sm" onClick={logout} className="text-white border-white hover:bg-primary-foreground/20">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Content area with sidebar */}
      <div className="flex flex-1">
        {/* Sidebar for navigation */}
        <aside className={`w-64 bg-muted flex-shrink-0 shadow-lg ${isMenuOpen ? 'block' : 'hidden'} md:block fixed md:static top-16 bottom-0 z-10`}>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-md transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent text-foreground hover:text-accent-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 bg-background">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
