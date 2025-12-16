import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut } from 'lucide-react';
import clsx from 'clsx'; // Ajuda a combinar classes condicionalmente

export function MainLayout() {
  const location = useLocation();

  // Lista de links do menu
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'Nova Venda', path: '/sales' },
    { icon: Package, label: 'Produtos', path: '/products' },
    { icon: Users, label: 'Moradores', path: '/residents' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* --- SIDEBAR (Lateral Esquerda) --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <LayoutDashboard />
            CondoStock
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gestão Inteligente</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Verifica se este é o link ativo
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' // Estilo do Ativo
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white' // Estilo Padrão
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-slate-800 rounded-lg transition-all">
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL (Direita) --- */}
      <main className="flex-1 ml-64 p-8">
        {/* O 'Outlet' é onde as páginas (Dashboard, Vendas, etc) serão renderizadas */}
        <Outlet />
      </main>
    </div>
  );
}