
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import {
  DashboardShell,
  DashboardMain,
  DashboardIntro,
} from "../../components/dashboard/DashboardLayout";

import OcorrenciaService from "../../services/OcorrenciaService";
import UsuarioService from "../../services/UsuarioService";

const EVENTO_ATUALIZACAO = "smartlift:ocorrencias-atualizadas";

const CORES = {
  azul: "#2861c8",
  azulEscuro: "#061f42",
  verde: "#43a36b",
  amarelo: "#e6a23c",
  vermelho: "#d9534f",
  roxo: "#8b79c8",
  cinza: "#718096",
};

// --------------------------------------------------
// ESTILIZAÇÃO
// --------------------------------------------------

const Container = styled.div`
  display: grid;
  gap: 1rem;
`;

const DemoAviso = styled.div`
  padding: 0.65rem 0.8rem;
  border-radius: 7px;
  background: #eef3fb;
  color: #42618e;
  font-size: 0.68rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 950px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`;

const Indicador = styled.div`
  background: white;
  border: 1px solid #e7ebf1;
  border-radius: 9px;
  padding: 1rem;
  min-height: 112px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  small {
    color: #69778b;
    font-size: 0.72rem;
  }

  strong {
    color: ${CORES.azulEscuro};
    font-size: 1.8rem;
  }

  span {
    color: #8994a3;
    font-size: 0.65rem;
  }
`;

const GradeGraficos = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 1fr);
  gap: 0.85rem;

  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
`;

const Painel = styled.section`
  min-width: 0;
  background: white;
  border: 1px solid #e7ebf1;
  border-radius: 9px;
  padding: 1rem;

  h2 {
    margin: 0;
    color: ${CORES.azulEscuro};
    font-size: 0.9rem;
  }

  > p {
    margin: 0.35rem 0 0.8rem;
    color: #7a8798;
    font-size: 0.68rem;
  }
`;

const AreaGrafico = styled.div`
  width: 100%;

  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
`;

const Legenda = styled.div`
  display: grid;
  gap: 0.55rem;
  margin-top: 0.5rem;
`;

const ItemLegenda = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: #526176;
  font-size: 0.7rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  strong {
    color: ${CORES.azulEscuro};
  }
`;

const Bolinha = styled.i`
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $cor }) => $cor};
`;

const LinhaBarra = styled.div`
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr) 2rem;
  align-items: center;
  gap: 0.6rem;
  margin: 1rem 0;
  color: #58677c;
  font-size: 0.7rem;

  strong {
    text-align: right;
    color: ${CORES.azulEscuro};
  }
`;

const BarraFundo = styled.div`
  height: 9px;
  border-radius: 20px;
  overflow: hidden;
  background: #edf0f4;
`;

const BarraPreenchida = styled.div`
  height: 100%;
  width: ${({ $largura }) => $largura}%;
  background: ${({ $cor }) => $cor};
  border-radius: inherit;
  transition: width 0.3s ease;
`;

const TabelaPainel = styled.section`
  background: white;
  border: 1px solid #e7ebf1;
  border-radius: 9px;
  overflow: hidden;
`;

const TabelaCabecalho = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  border-bottom: 1px solid #e7ebf1;

  h2 {
    color: ${CORES.azulEscuro};
    font-size: 0.9rem;
  }

  select {
    border: 1px solid #dce2ea;
    border-radius: 6px;
    padding: 0.45rem 0.6rem;
    background: white;
    color: #435168;
    font: inherit;
    font-size: 0.7rem;
  }
`;

const TabelaScroll = styled.div`
  overflow-x: auto;

  table {
    width: 100%;
    min-width: 680px;
    border-collapse: collapse;
  }

  th {
    background: #fbfcfd;
    color: #8290a2;
    font-size: 0.62rem;
    text-align: left;
    text-transform: uppercase;
  }

  td {
    color: #4e5d72;
    font-size: 0.69rem;
  }

  th, td {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #edf0f4;
  }

  td strong {
    display: block;
    color: ${CORES.azulEscuro};
    font-size: 0.7rem;
  }

  td small {
    color: #8a95a4;
    font-size: 0.62rem;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.62rem;
  font-weight: 700;

  color: ${({ $grupo }) =>
    $grupo === "concluidas"
      ? "#287849"
      : $grupo === "atendimento"
        ? "#2859b4"
        : "#996512"};

  background: ${({ $grupo }) =>
    $grupo === "concluidas"
      ? "#e8f5ec"
      : $grupo === "atendimento"
        ? "#eaf0ff"
        : "#fff4df"};
`;

const Vazio = styled.p`
  padding: 1.5rem;
  text-align: center;
  color: #7a8798;
  font-size: 0.75rem;
`;

// --------------------------------------------------
// DADOS FICTÍCIOS PARA DEMONSTRAÇÃO
// --------------------------------------------------

function dataDemonstrativa(mesesAtras, dia = 10) {
  const hoje = new Date();

  return new Date(
    hoje.getFullYear(),
    hoje.getMonth() - mesesAtras,
    dia,
    12
  ).toISOString();
}

const OCORRENCIAS_DEMO = [
  {
    id: "DEMO-1048",
    dataCriacao: dataDemonstrativa(0, 2),
    descricao: "Elevador apresenta ruído durante a subida.",
    categoria: "Ruído anormal",
    prioridade: "Alta",
    status: "Pendente",
    cliente: "Condomínio Horizonte",
    equipamento: "Elevador Torre A",
    local: "Santo André - SP",
  },
  {
    id: "DEMO-1047",
    dataCriacao: dataDemonstrativa(0, 5),
    descricao: "Portas não fecham completamente no térreo.",
    categoria: "Falha nas portas",
    prioridade: "Alta",
    status: "Em atendimento",
    cliente: "Edifício Parque Central",
    equipamento: "Elevador Social 1",
    local: "São Paulo - SP",
  },
  {
    id: "DEMO-1046",
    dataCriacao: dataDemonstrativa(0, 8),
    descricao: "Desnível no momento de chegada ao quarto andar.",
    categoria: "Problema de nivelamento",
    prioridade: "Média",
    status: "Em atendimento",
    cliente: "Centro Empresarial Sul",
    equipamento: "Elevador Bloco B",
    local: "São Bernardo - SP",
  },
  {
    id: "DEMO-1045",
    dataCriacao: dataDemonstrativa(1, 3),
    descricao: "Painel interno não responde ao comando.",
    categoria: "Falha no painel",
    prioridade: "Média",
    status: "Finalizada",
    cliente: "Hospital Santa Clara",
    equipamento: "Elevador Serviço",
    local: "São Paulo - SP",
  },
  {
    id: "DEMO-1044",
    dataCriacao: dataDemonstrativa(1, 12),
    descricao: "Equipamento parou entre o segundo e terceiro andar.",
    categoria: "Elevador parado",
    prioridade: "Alta",
    status: "Pendente",
    cliente: "Residencial das Flores",
    equipamento: "Elevador Torre 2",
    local: "Diadema - SP",
  },
  {
    id: "DEMO-1043",
    dataCriacao: dataDemonstrativa(2, 7),
    descricao: "Vibração incomum ao iniciar o deslocamento.",
    categoria: "Ruído anormal",
    prioridade: "Baixa",
    status: "Finalizada",
    cliente: "Clínica Vida",
    equipamento: "Elevador Principal",
    local: "Santo André - SP",
  },
  {
    id: "DEMO-1042",
    dataCriacao: dataDemonstrativa(2, 18),
    descricao: "Falha intermitente no sensor da porta.",
    categoria: "Falha nas portas",
    prioridade: "Média",
    status: "Finalizada",
    cliente: "Edifício Monte Azul",
    equipamento: "Elevador Social",
    local: "São Caetano - SP",
  },
  {
    id: "DEMO-1041",
    dataCriacao: dataDemonstrativa(3, 4),
    descricao: "Luz do painel de chamada apagada.",
    categoria: "Falha no painel",
    prioridade: "Baixa",
    status: "Finalizada",
    cliente: "Shopping Alameda",
    equipamento: "Elevador Leste",
    local: "São Paulo - SP",
  },
  {
    id: "DEMO-1040",
    dataCriacao: dataDemonstrativa(3, 15),
    descricao: "Elevador apresentou parada inesperada.",
    categoria: "Elevador parado",
    prioridade: "Alta",
    status: "Finalizada",
    cliente: "Torre Comercial Prime",
    equipamento: "Elevador 2",
    local: "Santo André - SP",
  },
  {
    id: "DEMO-1039",
    dataCriacao: dataDemonstrativa(4, 9),
    descricao: "Comando de abertura de porta lento.",
    categoria: "Falha nas portas",
    prioridade: "Baixa",
    status: "Finalizada",
    cliente: "Condomínio Alameda",
    equipamento: "Elevador Bloco C",
    local: "Mauá - SP",
  },
  {
    id: "DEMO-1038",
    dataCriacao: dataDemonstrativa(5, 6),
    descricao: "Ruído na casa de máquinas durante operação.",
    categoria: "Ruído anormal",
    prioridade: "Média",
    status: "Finalizada",
    cliente: "Edifício Paulista",
    equipamento: "Elevador Principal",
    local: "São Paulo - SP",
  },
  {
    id: "DEMO-1037",
    dataCriacao: dataDemonstrativa(5, 20),
    descricao: "Falha elétrica corrigida após inspeção.",
    categoria: "Problema elétrico",
    prioridade: "Alta",
    status: "Finalizada",
    cliente: "Centro Médico ABC",
    equipamento: "Elevador Bloco A",
    local: "Santo André - SP",
  },
];

// --------------------------------------------------
// FUNÇÕES AUXILIARES
// --------------------------------------------------

function grupoStatus(status = "") {
  const valor = status.toLowerCase();

  if (
    valor.includes("final") ||
    valor.includes("conclu") ||
    valor.includes("encerr")
  ) {
    return "concluidas";
  }

  if (
    valor.includes("atendimento") ||
    valor.includes("andamento") ||
    valor.includes("execução")
  ) {
    return "atendimento";
  }

  return "pendentes";
}

function obterData(ocorrencia) {
  if (ocorrencia.dataCriacao) {
    const data = new Date(ocorrencia.dataCriacao);

    if (!Number.isNaN(data.getTime())) {
      return data;
    }
  }

  // Os IDs gerados com Date.now() podem ser usados como data.
  const idNumerico = Number(ocorrencia.id);

  if (idNumerico > 1000000000000) {
    return new Date(idNumerico);
  }

  return null;
}

function formatarData(ocorrencia) {
  const data = obterData(ocorrencia);

  return data
    ? data.toLocaleDateString("pt-BR")
    : "Data não informada";
}

function normalizarOcorrencia(ocorrencia) {
  const contrato = ocorrencia.contrato;

  const cliente = contrato?.idCliente
    ? UsuarioService.buscarUsuarioPorId(contrato.idCliente)
    : null;

  const localizacao = contrato?.localizacao;

  return {
    ...ocorrencia,
    cliente: cliente
      ? `${cliente.nome} ${cliente.sobrenome || ""}`.trim()
      : "Cliente SmartLift",

    equipamento:
      contrato?.produtoApelido ||
      ocorrencia.contratoId ||
      "Equipamento não identificado",

    local: localizacao
      ? [localizacao.cidade, localizacao.estado]
          .filter(Boolean)
          .join(" - ")
      : "Local não informado",

    origem: "real",
  };
}

function calcularDadosMensais(ocorrencias) {
  const hoje = new Date();

  const meses = Array.from({ length: 6 }, (_, index) => {
    const data = new Date(
      hoje.getFullYear(),
      hoje.getMonth() - (5 - index),
      1
    );

    return {
      chave: `${data.getFullYear()}-${data.getMonth()}`,
      nome: data.toLocaleDateString("pt-BR", {
        month: "short",
      }).replace(".", ""),
      total: 0,
    };
  });

  const mapa = new Map(
    meses.map((mes) => [mes.chave, mes])
  );

  ocorrencias.forEach((ocorrencia) => {
    const data = obterData(ocorrencia);

    if (!data) return;

    const chave = `${data.getFullYear()}-${data.getMonth()}`;
    const mes = mapa.get(chave);

    if (mes) {
      mes.total += 1;
    }
  });

  return meses;
}

// --------------------------------------------------
// GRÁFICO DE VOLUME MENSAL
// --------------------------------------------------

function GraficoMensal({ dados }) {
  const maiorValor = Math.max(
    1,
    ...dados.map((item) => item.total)
  );

  const alturaGrafico = 135;
  const larguraBarra = 30;
  const espacamento = 27;

  return (
    <AreaGrafico>
      <svg
        viewBox="0 0 430 190"
        role="img"
        aria-label="Ocorrências cadastradas por mês"
      >
        {[0, 1, 2, 3].map((indice) => {
          const y = 12 + indice * 40;

          return (
            <g key={indice}>
              <line
                x1="28"
                x2="418"
                y1={y}
                y2={y}
                stroke="#edf0f4"
                strokeDasharray="3 4"
              />

              <text
                x="18"
                y={y + 3}
                fill="#93a0af"
                fontSize="9"
                textAnchor="end"
              >
                {Math.round(
                  maiorValor * (3 - indice) / 3
                )}
              </text>
            </g>
          );
        })}

        {dados.map((item, indice) => {
          const altura =
            (item.total / maiorValor) * alturaGrafico;

          const x = 48 + indice * (
            larguraBarra + espacamento
          );

          const y = 145 - altura;

          return (
            <g key={item.chave}>
              <rect
                x={x}
                y={y}
                width={larguraBarra}
                height={Math.max(2, altura)}
                rx="5"
                fill={CORES.azul}
                opacity={indice === 5 ? 1 : 0.72}
              />

              <text
                x={x + larguraBarra / 2}
                y={Math.max(10, y - 6)}
                textAnchor="middle"
                fontSize="10"
                fill="#34445b"
                fontWeight="600"
              >
                {item.total}
              </text>

              <text
                x={x + larguraBarra / 2}
                y="170"
                textAnchor="middle"
                fontSize="10"
                fill="#7c899a"
              >
                {item.nome}
              </text>
            </g>
          );
        })}
      </svg>
    </AreaGrafico>
  );
}

// --------------------------------------------------
// GRÁFICO DE CATEGORIAS
// --------------------------------------------------

function GraficoCategorias({ ocorrencias }) {
  const cores = [
    CORES.azul,
    CORES.verde,
    CORES.amarelo,
    CORES.roxo,
    CORES.vermelho,
    "#62a7b4",
  ];

  const categorias = ocorrencias.reduce((acumulado, item) => {
    const categoria = item.categoria || "Outros";

    acumulado[categoria] =
      (acumulado[categoria] || 0) + 1;

    return acumulado;
  }, {});

  const linhas = Object.entries(categorias)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const total = linhas.reduce(
    (soma, item) => soma + item[1],
    0
  );

  const circunferencia = 2 * Math.PI * 43;

  let deslocamento = 0;

  return (
    <>
      <AreaGrafico>
        <svg
          viewBox="0 0 300 150"
          role="img"
          aria-label="Distribuição por categoria"
        >
          <circle
            cx="75"
            cy="72"
            r="43"
            fill="none"
            stroke="#edf0f4"
            strokeWidth="16"
          />

          {linhas.map(([categoria, quantidade], indice) => {
            const comprimento =
              total > 0
                ? quantidade / total * circunferencia
                : 0;

            const offsetAtual = deslocamento;
            deslocamento += comprimento;

            return (
              <circle
                key={categoria}
                cx="75"
                cy="72"
                r="43"
                fill="none"
                stroke={cores[indice % cores.length]}
                strokeWidth="16"
                strokeDasharray={`${comprimento} ${circunferencia - comprimento}`}
                strokeDashoffset={-offsetAtual}
                transform="rotate(-90 75 72)"
              />
            );
          })}

          <text
            x="75"
            y="69"
            textAnchor="middle"
            fontSize="19"
            fontWeight="700"
            fill={CORES.azulEscuro}
          >
            {ocorrencias.length}
          </text>

          <text
            x="75"
            y="84"
            textAnchor="middle"
            fontSize="9"
            fill="#7c899a"
          >
            registros
          </text>
        </svg>
      </AreaGrafico>

      <Legenda>
        {linhas.map(([categoria, quantidade], indice) => (
          <ItemLegenda key={categoria}>
            <span>
              <Bolinha $cor={cores[indice % cores.length]} />
              {categoria}
            </span>

            <strong>{quantidade}</strong>
          </ItemLegenda>
        ))}

        {linhas.length === 0 && (
          <Vazio>Sem dados para exibir.</Vazio>
        )}
      </Legenda>
    </>
  );
}

// --------------------------------------------------
// DASHBOARD DO GESTOR
// --------------------------------------------------

export default function GestorDashboard({ usuario }) {
  const [ocorrenciasReais, setOcorrenciasReais] = useState([]);
  const [filtro, setFiltro] = useState("todas");

  // Busca os registros do sistema.
  const carregarOcorrencias = useCallback(() => {
    try {
      const registros = OcorrenciaService.buscarOcorrencias();

      setOcorrenciasReais(
        registros.map(normalizarOcorrencia)
      );
    } catch (erro) {
      console.error(
        "Erro ao carregar ocorrências:",
        erro
      );
    }
  }, []);

  // Atualiza quando uma ocorrência é cadastrada.
  useEffect(() => {
    carregarOcorrencias();

    window.addEventListener(
      EVENTO_ATUALIZACAO,
      carregarOcorrencias
    );

    // Atualização caso outra aba altere o localStorage.
    window.addEventListener(
      "storage",
      carregarOcorrencias
    );

    // Atualização ao voltar para a aba.
    window.addEventListener(
      "focus",
      carregarOcorrencias
    );

    return () => {
      window.removeEventListener(
        EVENTO_ATUALIZACAO,
        carregarOcorrencias
      );

      window.removeEventListener(
        "storage",
        carregarOcorrencias
      );

      window.removeEventListener(
        "focus",
        carregarOcorrencias
      );
    };
  }, [carregarOcorrencias]);

  // Junta os dados fictícios com os registros reais.
  // IDs iguais são considerados um único registro.
  const ocorrencias = useMemo(() => {
    const mapa = new Map();

    OCORRENCIAS_DEMO.forEach((item) => {
      mapa.set(String(item.id), {
        ...item,
        origem: "demo",
      });
    });

    ocorrenciasReais.forEach((item) => {
      mapa.set(String(item.id), item);
    });

    return Array.from(mapa.values()).sort((a, b) => {
      const dataA = obterData(a)?.getTime() || 0;
      const dataB = obterData(b)?.getTime() || 0;

      return dataB - dataA;
    });
  }, [ocorrenciasReais]);

  // Calcula os indicadores.
  const totais = useMemo(() => {
    return ocorrencias.reduce(
      (resultado, item) => {
        resultado.total += 1;
        resultado[grupoStatus(item.status)] += 1;

        return resultado;
      },
      {
        total: 0,
        pendentes: 0,
        atendimento: 0,
        concluidas: 0,
      }
    );
  }, [ocorrencias]);

  // Calcula prioridades.
  const prioridades = useMemo(() => {
    return ["Alta", "Média", "Baixa"].map((nome) => ({
      nome,

      total: ocorrencias.filter(
        (item) => (item.prioridade || "Média") === nome
      ).length,

      cor:
        nome === "Alta"
          ? CORES.vermelho
          : nome === "Média"
            ? CORES.amarelo
            : CORES.verde,
    }));
  }, [ocorrencias]);

  // Calcula os dados do gráfico mensal.
  const dadosMensais = useMemo(
    () => calcularDadosMensais(ocorrencias),
    [ocorrencias]
  );

  // Aplica o filtro da tabela.
  const ocorrenciasFiltradas = useMemo(() => {
    const resultado =
      filtro === "todas"
        ? ocorrencias
        : ocorrencias.filter(
            (item) => grupoStatus(item.status) === filtro
          );

    return resultado.slice(0, 10);
  }, [ocorrencias, filtro]);

  const navegacao = [
    {
      label: "Visão geral",
      icon: <i className="fa-solid fa-chart-pie" aria-hidden="true" />,
      active: true,
    },
    {
      label: "Todas as ocorrências",
      icon: <i className="fa-solid fa-clipboard-list" aria-hidden="true" />,
      badge: totais.total,
      onClick: () => setFiltro("todas"),
    },
    {
      label: "Pendentes",
      icon: <i className="fa-solid fa-clock" aria-hidden="true" />,
      badge: totais.pendentes,
      onClick: () => setFiltro("pendentes"),
    },
    {
      label: "Em atendimento",
      icon: <i className="fa-solid fa-gear" aria-hidden="true" />,
      badge: totais.atendimento,
      onClick: () => setFiltro("atendimento"),
    },
    {
      label: "Concluídas",
      icon: <i className="fa-solid fa-circle-check" aria-hidden="true" />,
      badge: totais.concluidas,
      onClick: () => setFiltro("concluidas"),
    },
  ];

  return (
    <DashboardShell
      user={usuario}
      role="Gestor"
      sidebarLabel="Navegação do gestor"
      navigation={navegacao}
      helpCard={{
        title: "Central SmartLift",
        description:
          "Acompanhe solicitações e priorize os atendimentos.",
        href: "mailto:suporte@smartlift.com.br",
        action: "Contatar suporte",
      }}
    >
      <DashboardMain>
        <Container>
          <DashboardIntro
            title={`Olá, ${usuario.nome}`}
            subtitle="Visão gerencial das ocorrências e indicadores operacionais."
          />

          <DemoAviso>
            <i className="fa-solid fa-circle-info" aria-hidden="true" />
            Ambiente demonstrativo: dados fictícios e novos cadastros reais.
          </DemoAviso>

          {/* INDICADORES */}
          <CardsGrid>
            <Indicador>
              <small>Total de ocorrências</small>
              <strong>{totais.total}</strong>
              <span>Todos os registros</span>
            </Indicador>

            <Indicador>
              <small>Pendentes</small>
              <strong>{totais.pendentes}</strong>
              <span>Aguardando atendimento</span>
            </Indicador>

            <Indicador>
              <small>Em atendimento</small>
              <strong>{totais.atendimento}</strong>
              <span>Em execução pela equipe</span>
            </Indicador>

            <Indicador>
              <small>Concluídas</small>
              <strong>{totais.concluidas}</strong>
              <span>Atendimentos finalizados</span>
            </Indicador>
          </CardsGrid>

          {/* GRÁFICOS */}
          <GradeGraficos>
            <Painel>
              <h2>Volume de ocorrências</h2>
              <p>
                Cadastros por mês · últimos seis meses
              </p>

              <GraficoMensal dados={dadosMensais} />
            </Painel>

            <Painel>
              <h2>Ocorrências por categoria</h2>
              <p>
                Distribuição dos problemas registrados
              </p>

              <GraficoCategorias
                ocorrencias={ocorrencias}
              />
            </Painel>
          </GradeGraficos>

          {/* PRIORIDADES E STATUS */}
          <GradeGraficos>
            <Painel>
              <h2>Prioridade das ocorrências</h2>
              <p>
                Distribuição por nível de criticidade
              </p>

              {prioridades.map((item) => (
                <LinhaBarra key={item.nome}>
                  <span>{item.nome}</span>

                  <BarraFundo>
                    <BarraPreenchida
                      $largura={
                        totais.total
                          ? (item.total / totais.total) * 100
                          : 0
                      }
                      $cor={item.cor}
                    />
                  </BarraFundo>

                  <strong>{item.total}</strong>
                </LinhaBarra>
              ))}
            </Painel>

            <Painel>
              <h2>Resumo operacional</h2>
              <p>
                Participação de cada situação na carteira
              </p>

              {[
                {
                  nome: "Pendentes",
                  total: totais.pendentes,
                  cor: CORES.amarelo,
                },
                {
                  nome: "Em atendimento",
                  total: totais.atendimento,
                  cor: CORES.azul,
                },
                {
                  nome: "Concluídas",
                  total: totais.concluidas,
                  cor: CORES.verde,
                },
              ].map((item) => (
                <LinhaBarra key={item.nome}>
                  <span>{item.nome}</span>

                  <BarraFundo>
                    <BarraPreenchida
                      $largura={
                        totais.total
                          ? (item.total / totais.total) * 100
                          : 0
                      }
                      $cor={item.cor}
                    />
                  </BarraFundo>

                  <strong>
                    {totais.total
                      ? Math.round(
                          (item.total / totais.total) * 100
                        )
                      : 0}
                    %
                  </strong>
                </LinhaBarra>
              ))}
            </Painel>
          </GradeGraficos>

          {/* TABELA DE OCORRÊNCIAS */}
          <TabelaPainel>
            <TabelaCabecalho>
              <h2>Ocorrências recentes</h2>

              <select
                aria-label="Filtrar ocorrências"
                value={filtro}
                onChange={(event) =>
                  setFiltro(event.target.value)
                }
              >
                <option value="todas">Todas</option>
                <option value="pendentes">Pendentes</option>
                <option value="atendimento">
                  Em atendimento
                </option>
                <option value="concluidas">Concluídas</option>
              </select>
            </TabelaCabecalho>

            <TabelaScroll>
              <table>
                <thead>
                  <tr>
                    <th>Código / Data</th>
                    <th>Cliente / Equipamento</th>
                    <th>Categoria</th>
                    <th>Prioridade</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {ocorrenciasFiltradas.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>#{item.id}</strong>
                        <small>{formatarData(item)}</small>
                      </td>

                      <td>
                        <strong>
                          {item.cliente || "Cliente SmartLift"}
                        </strong>

                        <small>
                          {item.equipamento || "Equipamento não identificado"}
                          {" · "}
                          {item.local || "Local não informado"}
                        </small>
                      </td>

                      <td>{item.categoria || "Outros"}</td>

                      <td>{item.prioridade || "Média"}</td>

                      <td>
                        <StatusBadge
                          $grupo={grupoStatus(item.status)}
                        >
                          {item.status || "Pendente"}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}

                  {ocorrenciasFiltradas.length === 0 && (
                    <tr>
                      <td colSpan="5">
                        <Vazio>
                          Nenhuma ocorrência encontrada.
                        </Vazio>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TabelaScroll>
          </TabelaPainel>
        </Container>
      </DashboardMain>
    </DashboardShell>
  );
}
