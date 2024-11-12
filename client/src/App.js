import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Importe seus componentes
import Login from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota de login */}
        <Route path="/login" element={<Login />} />

        {/* Rotas de admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>

        {/* Rotas de cliente */}
        <Route path="/client-dashboard" element={<ClientDashboard />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
