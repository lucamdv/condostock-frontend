import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Sales } from './pages/Sales';
import { Residents } from './pages/Residents';
import { Login } from './pages/Login';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';
import { ForcePasswordChange } from './components/ForcePasswordChange'; // <--- Importe o Modal de Segurança

function App() {
  // 1. Verifica se o usuário logado precisa trocar a senha
  const userJson = localStorage.getItem('condostock_user');
  const user = userJson ? JSON.parse(userJson) : null;
  
  // Se existir usuário e a flag isFirstLogin for true, ativamos o bloqueio
  const needsPasswordChange = user?.isFirstLogin;

  return (
    <>
      {/* SE for o primeiro login, este componente aparece por cima de tudo 
         e obriga o usuário a definir uma senha nova.
      */}
      {needsPasswordChange && <ForcePasswordChange />}

      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rota Privada (Qualquer um logado entra) */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            
            {/* Acessível para TODOS (Síndico e Morador) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />

            {/* --- ÁREA RESTRITA DO SÍNDICO --- */}
            <Route element={<AdminRoute />}>
              <Route path="/products" element={<Products />} />
              <Route path="/residents" element={<Residents />} />
            </Route>

          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;