import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Wrench, Clock, Users, AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.rol === 'GERENTE' || user?.rol === 'SUPERVISOR';
  console.log(user);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <Wrench className="w-8 h-8" />
            <h1 className="text-xl font-bold">NightCrawler</h1>
          </div>
          
          <nav className="space-y-2">
            <Link
              to="/"
              className={`flex items-center gap-2 p-2 rounded hover:bg-slate-700 ${
                location.pathname === '/' ? 'bg-slate-700' : ''
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>Timer</span>
            </Link>
            
            {isAdmin && (
              <>
                <Link
                  to="/logs"
                  className={`flex items-center gap-2 p-2 rounded hover:bg-slate-700 ${
                    location.pathname === '/logs' ? 'bg-slate-700' : ''
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span>Registros</span>
                </Link>
                
                <Link
                  to="/employees"
                  className={`flex items-center gap-2 p-2 rounded hover:bg-slate-700 ${
                    location.pathname === '/employees' ? 'bg-slate-700' : ''
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Empleados</span>
                </Link>
              </>
            )}
            
            <Link
              to="/incidents"
              className={`flex items-center gap-2 p-2 rounded hover:bg-slate-700 ${
                location.pathname === '/incidents' ? 'bg-slate-700' : ''
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Incidentes</span>
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-4">
          <button 
            onClick={logout}
            className="flex items-center gap-2 p-2 w-full rounded hover:bg-slate-700 text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;