import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./layouts/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Eventos from "./pages/Eventos.jsx";
import Financeiro from "./pages/Financeiro.jsx";
import Instrumentos from "./pages/Instrumentos.jsx";
import Login from "./pages/Login.jsx";
import Membros from "./pages/Membros.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="membros" element={<Membros />} />
        <Route path="instrumentos" element={<Instrumentos />} />
        <Route path="eventos" element={<Eventos />} />
        <Route path="financeiro" element={<Financeiro />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
