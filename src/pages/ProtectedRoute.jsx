import { Navigate, Outlet, useLocation } from "react-router";
import UsuarioService from "../services/UsuarioService";

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const usuario = UsuarioService.buscarUsuarioLogado();

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario.tipo)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={{ usuario }} />;
}
