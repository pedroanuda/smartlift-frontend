import UsuarioService from "../services/UsuarioService";
import db from "../db";

import ClienteDashboard from "./customer/ClienteDashboard";
import TecnicoDashboard from "./technician/TecnicoDashboard";

export default function Home() {
  const usuario = UsuarioService.buscarUsuarioPorId(db.dados.logado);

  if (!usuario) {
    return <div>Usuário não encontrado.</div>;
  }

  if (usuario.tipo === "cliente") {
    return <ClienteDashboard usuario={usuario} />;
  }

  if (usuario.tipo === "tecnico") {
    return <TecnicoDashboard usuario={usuario} />;
  }

  return <div>Bem-vindo, {usuario.nome}!</div>;
}
