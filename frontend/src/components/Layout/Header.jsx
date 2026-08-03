import { useState } from 'react';
import { Menu as HeadlessMenu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, LogOut, User, Sun, Moon, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:text-slate-300 lg:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú lateral"
      >
        <Menu size={24} aria-hidden="true" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-x-4 self-stretch lg:gap-x-6">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {theme === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </button>

        <HeadlessMenu as="div" className="relative">
          <MenuButton className="group flex items-center gap-x-4 focus:outline-none transition-transform duration-200 hover:scale-105">
            <div className="hidden flex-col items-end lg:flex">
              <span className="text-sm font-semibold leading-6 text-slate-900 transition-colors group-hover:text-brand-600 dark:text-white">{user?.nombre}</span>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold leading-4 text-brand-600 ring-1 ring-brand-200/50 shadow-sm dark:bg-brand-900/30 dark:text-brand-400 dark:ring-brand-800">
                {user?.rol}
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-blue-600 text-sm font-bold text-white shadow-md shadow-brand-500/20 ring-2 ring-white transition-all duration-300 group-hover:shadow-lg dark:ring-slate-800">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            <ChevronDown size={16} className="hidden text-slate-400 lg:block" aria-hidden="true" />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <MenuItems className="absolute right-0 z-20 mt-3 w-56 origin-top-right rounded-2xl bg-white py-2 shadow-2xl ring-1 ring-slate-900/5 focus:outline-none dark:bg-slate-800 dark:ring-slate-700/50">
              <div className="mb-1 border-b border-slate-100 px-4 py-3 dark:border-slate-700/50 lg:hidden">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.nombre}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.correo}</p>
              </div>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => navigate('/profile')}
                    className={`flex w-full items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                      focus ? 'bg-slate-50 text-slate-900 dark:bg-slate-700/50 dark:text-white' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <User size={18} className="mr-3 text-slate-400" aria-hidden="true" /> Mi Perfil
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={handleLogout}
                    className={`flex w-full items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                      focus ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <LogOut size={18} className="mr-3 text-rose-400" aria-hidden="true" /> Cerrar sesión
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </HeadlessMenu>
      </div>
    </header>
  );
};

export default Header;