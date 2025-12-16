import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  Search,
  ShoppingCart,
  Trash2,
  CreditCard,
  User,
  CheckCircle,
} from "lucide-react";
import { ProductThumbnail } from "../components/ProductThumbnail";

// Tipos
interface Product {
  id: string;
  name: string;
  price: string;
  totalStock: number;
  barcode: string;
}

interface CartItem extends Product {
  quantity: number;
}

export function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentType, setPaymentType] = useState("CASH");
  const [loading, setLoading] = useState(false);

  // Carrega produtos ao abrir a tela
  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  // Adicionar ao Carrinho
  function addToCart(product: Product) {
    // Verifica se tem estoque
    if (product.totalStock <= 0) return alert("Produto sem estoque!");

    setCart((prev) => {
      const itemExists = prev.find((i) => i.id === product.id);

      // Se já existe, aumenta quantidade
      if (itemExists) {
        // Trava se tentar vender mais que o estoque
        if (itemExists.quantity >= product.totalStock) {
          alert("Estoque máximo atingido para este item.");
          return prev;
        }
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      // Se não existe, adiciona novo
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  // Remover do Carrinho
  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  // Calcular Total
  const total = cart.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity;
  }, 0);

  // Finalizar Venda
  async function handleCheckout() {
    if (cart.length === 0) return alert("O carrinho está vazio.");

    setLoading(true);
    try {
      // Monta o JSON igual testamos no Swagger
      const saleData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentType: paymentType,
        // residentId: null (Faremos a seleção de morador na próxima etapa)
      };

      await api.post("/sales", saleData);

      alert("Venda realizada com sucesso! 💰");
      setCart([]); // Limpa carrinho

      // Recarrega produtos para atualizar o estoque visualmente
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      alert("Erro ao finalizar venda.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Filtro de busca local
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6 p-6">
      {/* --- COLUNA DA ESQUERDA: CATÁLOGO --- */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Nova Venda</h1>
          <p className="text-slate-500">
            Selecione os produtos para adicionar.
          </p>
        </div>

        {/* Busca */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar produto..."
            className="flex-1 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid de Produtos - VISUAL LIMPO E-COMMERCE */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4 pr-2">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.totalStock === 0}
              className={`rounded-xl border text-left transition-all hover:shadow-lg hover:border-blue-400 flex flex-col h-auto bg-white overflow-hidden group
                ${
                  product.totalStock === 0
                    ? "opacity-60 grayscale cursor-not-allowed border-slate-200"
                    : "border-slate-200"
                }`}
            >
              {/* --- ÁREA DA IMAGEM --- */}
              <div className="h-48 w-full bg-white relative p-4 border-b border-slate-50">
                <ProductThumbnail
                  barcode={product.barcode}
                  alt={product.name}
                />

                {/* Badge de Estoque (Pílula Flutuante) */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border border-white/20 ${
                      product.totalStock > 0
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.totalStock} un
                  </span>
                </div>
              </div>

              {/* --- INFORMAÇÕES --- */}
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-slate-700 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                <div className="flex items-end justify-between mt-1">
                  <p className="font-bold text-blue-600 text-lg">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(product.price))}
                  </p>

                  {/* Botãozinho visual de + */}
                  <div className="w-8 h-8 rounded-full bg-slate-50 text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xl font-bold mb-1">+</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* --- COLUNA DA DIREITA: CARRINHO --- */}
      <div className="w-96 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" /> Carrinho
          </h2>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShoppingCart size={48} className="mb-2 opacity-20" />
              <p>Carrinho vazio</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.quantity}x{" "}
                    {Number(item.price).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700">
                    {(item.quantity * Number(item.price)).toLocaleString(
                      "pt-BR",
                      { style: "currency", currency: "BRL" }
                    )}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé e Pagamento */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
          {/* Seletor de Pagamento Simplificado */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">
              Pagamento
            </label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {["CASH", "PIX", "DEBIT_CARD"].map((type) => (
                <button
                  key={type}
                  onClick={() => setPaymentType(type)}
                  className={`text-xs font-bold py-2 rounded border transition-colors
                    ${
                      paymentType === type
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                    }`}
                >
                  {type === "CASH"
                    ? "DINHEIRO"
                    : type === "DEBIT_CARD"
                    ? "DÉBITO"
                    : type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-end">
            <span className="text-slate-500">Total</span>
            <span className="text-3xl font-bold text-slate-800">
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200"
          >
            {loading ? (
              "Processando..."
            ) : (
              <>
                <CheckCircle /> Finalizar Venda
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
