import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products"; // <--- Importe aqui
import { Sales } from "./pages/Sales";
import { Residents } from "./pages/Residents";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />{" "}
        <Route path="/sales" element={<Sales />} />
        <Route path="/residents" element={<Residents />} />
      </Route>
    </Routes>
  );
}

export default App;
