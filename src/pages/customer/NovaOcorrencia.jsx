
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import styled from "styled-components";

import {
  DashboardShell,
  DashboardMain,
  DashboardIntro,
} from "../../components/dashboard/DashboardLayout";

import db from "../../db";
import UsuarioService from "../../services/UsuarioService";
import ContratoService from "../../services/ContratoService";

// ------------------------------------------
// ESTILIZAÇÃO
// ------------------------------------------

const FormContainer = styled.section`
  background: #fff;
  border: 1px solid #e3e5e8;
  padding: 1.2rem 1.15rem 1rem;
  width: 100%;
`;

const FormTitle = styled.h2`
  color: #161616;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 2rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;

  label, legend {
    font-size: 0.73rem;
    font-weight: 600;
    color: #171717;
  }

  .required {
    color: #ed3434;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 2.45rem;
  padding: 0 0.8rem;
  border: 1px solid #d5d5d5;
  border-radius: 0;
  background: white;
  color: #555;
  font-size: 0.73rem;

  &:focus {
    outline: 1px solid #244c80;
    border-color: #244c80;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 5.5rem;
  padding: 0.8rem;
  border: 1px solid #d5d5d5;
  resize: vertical;
  font-family: inherit;
  font-size: 0.75rem;

  &:focus {
    outline: 1px solid #244c80;
  }
`;

const PriorityOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.7rem;

  label {
    height: 2.45rem;
    border: 1px solid #d5d5d5;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    font-size: 0.7rem;
    font-weight: 400;
    cursor: pointer;
  }

  label:has(input:checked) {
    background: #f1f4f8;
    border-color: #244c80;
  }

  input {
    position: absolute;
    opacity: 0;
  }

  label:has(input:focus-visible) {
    outline: 2px solid #244c80;
  }
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
`;

const FrequencyOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.7rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 400;
    cursor: pointer;
  }

  input {
    accent-color: #09254b;
  }
`;

const FileContainer = styled.label`
  width: 100%;
  min-height: 2.5rem;
  border: 1px solid #d5d5d5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0.6rem;
  color: #777;
  font-size: 0.7rem;
  cursor: pointer;

  input {
    display: none;
  }
`;

const FileNames = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  color: #244c80;
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.8rem;

  button {
    width: 7.5rem;
    height: 2.3rem;
    border: none;
    border-radius: 5px;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
  }

  @media (max-width: 480px) {
    button {
      flex: 1;
    }
  }
`;

const CancelButton = styled.button`
  background: #dedede;
  color: #111;
`;

const SubmitButton = styled.button`
  background: #061f42;
  color: white;

  &:hover {
    background: #173b68;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Feedback = styled.p`
  margin-top: 0.8rem;
  font-size: 0.75rem;
  color: ${({ $error }) => $error ? "#c62828" : "#267443"};
`;

// ------------------------------------------
// COMPONENTE
// ------------------------------------------

export default function NovaOcorrencia() {
  const navigate = useNavigate();

  const usuario = UsuarioService.buscarUsuarioPorId(
    db.dados.logado
  );

  const contratos = usuario
    ? ContratoService.buscarContratosPorClienteId(usuario.id)
    : [];

  const contratosAtivos = contratos.filter(
    contrato =>
      contrato.statusOperacional?.toLowerCase() === "ativo"
  );

  const [form, setForm] = useState({
    contratoId: "",
    categoria: "",
    prioridade: "Média",
    descricao: "",
    frequencia: "todo",
    horario: "",
  });

  const [arquivos, setArquivos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);
  const [enviando, setEnviando] = useState(false);

  if (!usuario || usuario.tipo !== "cliente") {
    return <Navigate to="/" replace />;
  }

  const navigation = [
    {
      label: "Painel do Cliente",
      icon: "⌂",
      onClick: () => navigate("/")
    },
    {
      label: "Minhas Ocorrências",
      icon: "▤",
      onClick: () => navigate("/")
    },
    {
      label: "Cadastrar Ocorrência",
      icon: "✚",
      active: true
    },
    {
      label: "Meus Equipamentos",
      icon: "▣",
      onClick: () => navigate("/")
    },
    {
      label: "Contratos",
      icon: "▧",
      onClick: () => navigate("/")
    },
    {
      label: "Documentos",
      icon: "▤",
      disabled: true
    },
    {
      label: "Notificações",
      icon: "♧",
      onClick: () => navigate("/")
    },
    {
      label: "Perfil e Acesso",
      icon: "♙",
      disabled: true
    },
    {
      label: "Ajuda e Suporte",
      icon: "?",
      disabled: true
    }
  ];

  function handleChange(event) {
    const { name, value } = event.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleFiles(event) {
    const selecionados = Array.from(event.target.files || []);

    const tamanhoMaximo = 5 * 1024 * 1024;

    if (selecionados.some(file => file.size > tamanhoMaximo)) {
      setErro(true);
      setMensagem("Cada arquivo deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    setArquivos(selecionados);
    setMensagem("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (enviando) return;

    if (
      !form.contratoId ||
      !form.categoria ||
      form.descricao.trim().length < 10
    ) {
      setErro(true);
      setMensagem(
        "Preencha os campos obrigatórios. A descrição deve ter pelo menos 10 caracteres."
      );
      return;
    }

    if (form.frequencia === "horario" && !form.horario) {
      setErro(true);
      setMensagem("Informe o horário em que o problema ocorre.");
      return;
    }

    setEnviando(true);

    try {
      const novaOcorrencia = {
        id: Date.now(),

        contratoId: form.contratoId,
        descricao: form.descricao.trim(),
        categoria: form.categoria,
        status: "Pendente",

        // Relacionamentos já previstos no modelo original
        atendimentos: [],

        avaliacao: {
          nota: null,
          comentario: ""
        },

        // Informações adicionais coletadas pelo formulário.
        // Permanecem como metadados no registro bruto.
        prioridade: form.prioridade,
        frequencia: form.frequencia,
        horario: form.frequencia === "horario"
          ? form.horario
          : null,

        anexos: arquivos.map(file => ({
          nome: file.name,
          tipo: file.type,
          tamanho: file.size
        }))
      };

      // Atualização da base simulada em memória
      db.dados.ocorrencias.push(novaOcorrencia);

      // Persistência local do registro criado
      const registrosSalvos = JSON.parse(
        localStorage.getItem("smartlift.novasOcorrencias") || "[]"
      );

      registrosSalvos.push(novaOcorrencia);

      localStorage.setItem(
        "smartlift.novasOcorrencias",
        JSON.stringify(registrosSalvos)
      );

      setErro(false);
      setMensagem(
        `Ocorrência registrada com sucesso! Código: ${novaOcorrencia.id}`
      );

      setForm({
        contratoId: "",
        categoria: "",
        prioridade: "Média",
        descricao: "",
        frequencia: "todo",
        horario: ""
      });

      setArquivos([]);

      event.target.reset();

    } catch (error) {
      console.error("Erro ao cadastrar ocorrência:", error);
      setErro(true);
      setMensagem("Não foi possível registrar a ocorrência.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <DashboardShell
      user={usuario}
      role="Cliente"
      sidebarLabel="Navegação do cliente"
      navigation={navigation}
      helpCard={{
        title: "Precisa de ajuda?",
        description: "Fale com a nossa central de atendimento 24h.",
        href: "mailto:suporte@smartlift.com.br",
        action: "Abrir chamado"
      }}
    >
      <DashboardMain>
        <DashboardIntro
          title={`Olá, ${usuario.nome}`}
          subtitle="Preencha as informações abaixo para registrar uma nova ocorrência"
        />

        <FormContainer>
          <FormTitle>Dados da Ocorrência</FormTitle>

          <form onSubmit={handleSubmit}>
            <Grid>

              <Field>
                <label htmlFor="contratoId">
                  Equipamento <span className="required">*</span>
                </label>

                <Select
                  id="contratoId"
                  name="contratoId"
                  value={form.contratoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o equipamento</option>

                  {contratosAtivos.map(contrato => (
                    <option key={contrato.id} value={contrato.id}>
                      {contrato.produtoApelido}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <label htmlFor="local">
                  Local / Unidade <span className="required">*</span>
                </label>

                <Select
                  id="local"
                  value={form.contratoId}
                  onChange={event =>
                    setForm(prev => ({
                      ...prev,
                      contratoId: event.target.value
                    }))
                  }
                  required
                >
                  <option value="">Selecione o local</option>

                  {contratosAtivos.map(contrato => (
                    <option key={contrato.id} value={contrato.id}>
                      {contrato.localizacao?.apelido}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <label htmlFor="categoria">
                  Tipo de problema <span className="required">*</span>
                </label>

                <Select
                  id="categoria"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o tipo de problema</option>
                  <option value="Elevador parado">Elevador parado</option>
                  <option value="Ruído anormal">Ruído anormal</option>
                  <option value="Falha nas portas">Falha nas portas</option>
                  <option value="Problema de nivelamento">
                    Problema de nivelamento
                  </option>
                  <option value="Falha no painel">Falha no painel</option>
                  <option value="Problema elétrico">Problema elétrico</option>
                  <option value="Outro">Outro</option>
                </Select>
              </Field>

              <Field>
                <Fieldset>
                  <legend>
                    Prioridade <span className="required">*</span>
                  </legend>

                  <PriorityOptions $selected={form.prioridade}>
                    {[
                      { value: "Baixa", color: "#69ca4c" },
                      { value: "Média", color: "#f28b20" },
                      { value: "Alta", color: "#ff3535" }
                    ].map(item => (
                      <label
                        key={item.value}                     >

                        <input
                          type="radio"
                          name="prioridade"
                          value={item.value}
                          checked={form.prioridade === item.value}
                          onChange={handleChange}
                        />

                        <Dot $color={item.color} />
                        {item.value}
                      </label>
                    ))}
                  </PriorityOptions>
                </Fieldset>
              </Field>
            </Grid>

            <Field style={{ marginTop: "1.2rem" }}>
              <label htmlFor="descricao">
                Descrição do problema <span className="required">*</span>
              </label>

              <Textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descrição do problema."
                minLength={10}
                required
              />
            </Field>

            <Field style={{ marginTop: "1.2rem" }}>
              <Fieldset>
                <legend>Quando o problema ocorre?</legend>

                <FrequencyOptions>
                  <label>
                    <input
                      type="radio"
                      name="frequencia"
                      value="todo"
                      checked={form.frequencia === "todo"}
                      onChange={handleChange}
                    />
                    O tempo todo
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="frequencia"
                      value="intermitente"
                      checked={form.frequencia === "intermitente"}
                      onChange={handleChange}
                    />
                    Intermitente
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="frequencia"
                      value="horario"
                      checked={form.frequencia === "horario"}
                      onChange={handleChange}
                    />
                    Em um horário específico
                  </label>
                </FrequencyOptions>
              </Fieldset>

              {form.frequencia === "horario" && (
                <input
                type="time"
                style={{
                    height: "2.45rem",
                    border: "1px solid #d5d5d5",
                    padding: "0 0.8rem",
                    width: "100%"
                }}
                  name="horario"
                  value={form.horario}
                  onChange={handleChange}
                  required
                />
              )}
            </Field>

            <Field style={{ marginTop: "1.2rem" }}>
              <label>Anexos (opcional)</label>

              <FileContainer>
                Arraste e solte arquivos aqui ou clique para selecionar

                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFiles}
                />

                {arquivos.length > 0 && (
                  <FileNames>
                    {arquivos.map((file, index) => (
                      <div key={`${file.name}-${index}`}>
                        {file.name}
                      </div>
                    ))}
                  </FileNames>
                )}
              </FileContainer>
            </Field>

            {mensagem && (
              <Feedback $error={erro} role="status">
                {mensagem}
              </Feedback>
            )}

            <Buttons>
              <CancelButton
                type="button"
                onClick={() => navigate("/")}
              >
                Cancelar
              </CancelButton>

              <SubmitButton
                type="submit"
                disabled={enviando || contratosAtivos.length === 0}
              >
                {enviando ? "Enviando..." : "Enviar Ocorrência"}
              </SubmitButton>
            </Buttons>

          </form>
        </FormContainer>
      </DashboardMain>
    </DashboardShell>
  );
}
