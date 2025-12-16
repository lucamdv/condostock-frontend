import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp } from 'lucide-react';

// Define o formato dos dados que vêm do Backend
interface DashboardData {
  revenue: {
    today: number;
    month: number;
    ordersToday: number;
  };
  finance: {
    totalReceivable: number;
  };
  alerts: {
    lowStockCount: number;
    items: Array<{
      name: string;
      currentStock: number;
      minStock: number;
    }>;
  };
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os dados assim que a tela carrega
    api.get('/dashboard')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dashboard", error);
        alert("Erro ao conectar com o servidor.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500">Carregando indicadores...</div>;
  }

  if (!data) return null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Painel do Síndico</h1>
      <p className="text-slate-500 mb-8">Visão geral do seu mercadinho.</p>
      
      {/* GRID DE CARDS (Indicadores) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Vendas Hoje</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.revenue.today)}
            </h3>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp size={14} /> {data.revenue.ordersToday} pedidos
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Faturamento Mês</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.revenue.month)}
            </h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">A Receber (Fiado)</p>
            <h3 className="text-2xl font-bold text-orange-600 mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.finance.totalReceivable)}
            </h3>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <UsersIcon size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Estoque Crítico</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">
              {data.alerts.lowStockCount} itens
            </h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Tabela de Alertas de Estoque */}
      {data.alerts.items.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="font-bold text-slate-800">Itens Precisando de Reposição</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Produto</th>
                <th className="px-6 py-3 font-medium">Mínimo</th>
                <th className="px-6 py-3 font-medium">Atual</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.alerts.items.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-800 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-slate-600">{item.minStock}</td>
                  <td className="px-6 py-4 text-red-600 font-bold">{item.currentStock}</td>
                  <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                      BAIXO
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Pequeno helper para ícone que faltou no import lá em cima (Users)
import { Users as UsersIcon } from 'lucide-react';