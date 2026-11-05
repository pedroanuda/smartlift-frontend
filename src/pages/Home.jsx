/* eslint-disable no-unused-vars */
import UsuarioService from "../services/UsuarioService"
import db from "../db"
import ClienteDashboard from "./customer/ClienteDashboard";

export default function Home() {
  const usuario = UsuarioService.buscarUsuarioPorId(db.dados.logado);

  if (usuario?.tipo === "cliente") {
    return <ClienteDashboard usuario={usuario} />;
  }

  return (
    <div>Bem vindo, {usuario?.tipo}!</div>
  )
}
