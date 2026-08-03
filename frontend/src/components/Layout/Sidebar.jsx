import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Building2, UserCog, X } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { hasRole } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, show: true },
    { name: 'Talentos', path: '/talentos', icon: Users, show: true },
    { name: 'Empresas', path: '/empresas', icon: Building2, show: true },
    { name: 'Reclutadores', path: '/reclutadores', icon: UserCog, show: hasRole(['Administrador']) },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden lg:z-auto transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        aria-hidden="true" 
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/60 dark:border-slate-800 transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/60 dark:border-slate-800">
          <NavLink to="/dashboard" className="group flex items-center gap-2 transition-transform hover:scale-105">
            <img src="/logo.svg" alt="Talentia" className="h-8 w-8" />
            <span className="bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-brand-400 dark:to-blue-500">Talentia</span>
          </NavLink>
          <button className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú lateral">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1.5">
            {navItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    aria-current="page"
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                      }`
                    }
                  >
                    <Icon size={20} className="shrink-0" aria-hidden="true" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
