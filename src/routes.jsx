import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import ClienteDashboard from "./pages/customer/ClienteDashboard";
import NovaOcorrencia from "./pages/customer/NovaOcorrencia";
import TecnicoDashboard from "./pages/technician/TecnicoDashboard";
import GestorDashboard from "./pages/manager/GestorDashboard";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        element: <ProtectedRoute allowedRoles={["cliente"]} />,
        children: [
          {
            path: "/cliente/ocorrencias",
            element: <ClienteDashboard secao="ocorrencias" />,
          },
          {
            path: "/cliente/equipamentos",
            element: <ClienteDashboard secao="equipamentos" />,
          },
          {
            path: "/cliente/notificacoes",
            element: <ClienteDashboard secao="notificacoes" />,
          },
          {
            path: "/ocorrencias/nova",
            element: <NovaOcorrencia />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["tecnico"]} />,
        children: [
          {
            path: "/tecnico/ocorrencias",
            element: <TecnicoDashboard secao="ocorrencias" />,
          },
          {
            path: "/tecnico/notificacoes",
            element: <TecnicoDashboard secao="notificacoes" />,
          },
          {
            path: "/tecnico/suporte",
            element: <TecnicoDashboard secao="suporte" />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["gestor"]} />,
        children: [
          {
            path: "/gestor/ocorrencias",
            element: <GestorDashboard secao="ocorrencias" />,
          },
          {
            path: "/gestor/indicadores",
            element: <GestorDashboard secao="indicadores" />,
          },
          {
            path: "/gestor/notificacoes",
            element: <GestorDashboard secao="notificacoes" />,
          },
        ],
      },
    ],
  },
]);
