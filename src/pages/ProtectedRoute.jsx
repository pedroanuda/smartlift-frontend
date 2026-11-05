import { Navigate, Outlet, useLocation } from "react-router"
import db from "../db"

export default function ProtectedRoute() {
  const location = useLocation();
  if (!db.dados.logado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
