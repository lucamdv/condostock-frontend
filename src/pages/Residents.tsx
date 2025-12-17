import { useEffect, useState } from "react";
import { api } from "../services/api";
import { User, Home, Phone, Wallet, Plus, Search } from "lucide-react";
// IMPORT NOVO 👇
import { HistoryModal } from "../components/HistoryModal";

interface Resident {
  id: string;
  name: string;
  apartment: string;
  block: string;
  phone: string;
  account: {
    id: string;
    balance: number;
    status: "ACTIVE" | "BLOCKED";
  };
}

export function Residents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ESTADO NOVO 👇
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);

  useEffect(() => {
    loadResidents();
  }, [viewingHistoryId]); // Recarrega se fechar o modal (vai que muda algo)

  async function loadResidents() {
    try {
      const response = await api.get("/residents");
      setResidents(response.data);
    } catch (error) {
      console.error("Erro ao carregar moradores", error);
    } finally {
      setLoading(false);
    }
  }

  // Função simplificada de cadastro (mantida do anterior)
  async function handleNewResident() {
    const name = prompt("Nome do Morador:");
    if (!name) return;
    const cpf = prompt("CPF (apenas números ou com ponto):"); // <--- MUDOU
    if (!cpf) return;
    const apt = prompt("Apartamento:");

    try {
      await api.post("/residents", {
        name,
        cpf, // O backend vai pegar os 4 primeiros dígitos disso pra ser a senha
        apartment: apt || "000",
        block: "A",
      });
      loadResidents();
      alert(
        `Morador cadastrado! A senha inicial são os 4 primeiros dígitos do CPF: ${cpf.substring(
          0,
          4
        )}`
      );
    } catch (error) {
      alert("Erro ao cadastrar. Verifique se o CPF já existe.");
    }
  }

  const filteredResidents = residents.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.apartment.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Moradores</h1>
          <p className="text-slate-500">Gestão de contas e crédito.</p>
        </div>

        <button
          onClick={handleNewResident}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Novo Morador
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome ou apartamento..."
          className="flex-1 outline-none text-slate-700 placeholder-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-500">Carregando...</p>
        ) : (
          filteredResidents.map((resident) => (
            <div
              key={resident.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">
                      {resident.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Home size={12} />
                      <span>
                        Apt {resident.apartment} - Bloco {resident.block}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    resident.account?.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {resident.account?.status === "ACTIVE"
                    ? "Ativo"
                    : "Bloqueado"}
                </span>
              </div>

              <div className="border-t border-slate-50 pt-4 mt-2 space-y-3">
                <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                    <Wallet size={18} className="text-blue-500" />
                    <span>Saldo Devedor</span>
                  </div>
                  <span
                    className={`font-bold text-lg ${
                      Number(resident.account?.balance || 0) > 0
                        ? "text-red-500"
                        : "text-slate-700"
                    }`}
                  >
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(resident.account?.balance || 0))}
                  </span>
                </div>

                {/* BOTÃO ATIVADO 👇 */}
                <button
                  onClick={() => setViewingHistoryId(resident.id)}
                  className="w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                >
                  Ver Extrato Detalhado
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL QUE ABRE QUANDO CLICA 👇 */}
      {viewingHistoryId && (
        <HistoryModal
          residentId={viewingHistoryId}
          onClose={() => setViewingHistoryId(null)}
        />
      )}
    </div>
  );
}
