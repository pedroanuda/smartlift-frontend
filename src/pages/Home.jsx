
import UsuarioService from "../services/UsuarioService";
import db from "../db";

import ClienteDashboard from "./customer/ClienteDashboard";
import TecnicoDashboard from "./technician/TecnicoDashboard";
import GestorDashboard from "./manager/GestorDashboard";

export default function Home() {
  const usuario = UsuarioService.buscarUsuarioPorId(
    db.dados.logado
  );

  if (!usuario) {
    return <div>Usuário não encontrado.</div>;
  }

  if (usuario.tipo === "cliente") {
    return <ClienteDashboard usuario={usuario} />;
  }

  if (usuario.tipo === "tecnico") {
    return <TecnicoDashboard usuario={usuario} />;
  }

  if (usuario.tipo === "gestor") {
    return <GestorDashboard usuario={usuario} />;
  }

  return <div>Tipo de usuário não reconhecido.</div>;
}
