import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FolderOpen,
  ClipboardCheck,
  BarChart3
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isCoordinador } = useAuth();

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: [1, 2],
    },
    {
      path: '/expedientes',
      label: 'Expedientes',
      icon: FolderOpen,
      roles: [1, 2],
    },
    {
      path: '/revision',
      label: 'Revisión',
      icon: ClipboardCheck,
      roles: [2],
    },
    {
      path: '/reportes',
      label: 'Reportes',
      icon: BarChart3,
      roles: [2],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.IdRol)
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-dicri-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
