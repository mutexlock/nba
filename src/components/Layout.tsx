import { Outlet, Link, useLocation } from 'react-router-dom';
import { useStore } from '../stores/appStore';

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/players', label: '球员库', icon: '👥' },
  { path: '/teams', label: '球队', icon: '🏀' },
  { path: '/battle', label: '对战', icon: '⚔️' },
  { path: '/battle-record', label: '记录', icon: '📊' },
];

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a12] text-gray-100">
      <header className="bg-[#1a1a2e] border-b border-[#2a2a4e]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-2xl">🏀</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                NBA跨时代对战模拟器
              </h1>
            </Link>
            <nav className="flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <footer className="border-t border-[#2a2a4e] mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-500 text-sm">
          <p>跨时代NBA对战模拟器 - 让传奇球队同场竞技</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;