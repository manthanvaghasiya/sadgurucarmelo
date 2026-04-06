import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  Users,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronLeft,
  Menu,
  Mail,
  Image as ImageIcon,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Inventory', path: '/admin/inventory', icon: Car },
  { name: 'Add New Car', path: '/admin/add-car', icon: PlusCircle },
  { name: 'Leads', path: '/admin/leads', icon: Users },
  { name: 'Messages', path: '/admin/messages', icon: Mail },
  { name: 'Posters', path: '/admin/posters', icon: ImageIcon },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col
          bg-primary text-white
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[78px]' : 'w-[260px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header / Branding */}
        <div className="flex items-center gap-3 px-5 h-[72px] border-b border-white/10 shrink-0">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-heading font-black text-xl shadow-lg shadow-accent/30 shrink-0">
            S
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-heading font-bold text-[15px] leading-tight whitespace-nowrap">
                Sadguru Admin
              </span>
              <span className="font-body text-[10px] text-white/50 font-semibold uppercase tracking-widest">
                Control Panel
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                title={sidebarCollapsed ? item.name : undefined}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl
                  font-body text-sm font-semibold
                  transition-all duration-200
                  group relative
                  ${active
                    ? 'bg-white/15 text-white shadow-inner'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent rounded-r-full" />
                )}
                <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 pb-4 space-y-2 shrink-0">
          {/* Collapse Toggle (desktop only) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex items-center gap-3 w-full px-3 py-3 rounded-xl font-body text-sm font-semibold text-white/40 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
            />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl font-body text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">



        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
