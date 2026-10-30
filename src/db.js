const mockDb = {
  usuarios: [
    {
      id: 1,
      nome: 'João',
      sobrenome: 'Silva',
      tipo: 'cliente',
      email: 'joao.silva@teste.com',
      senha: '123'
    },
    {
      id: 2,
      nome: 'Maria',
      sobrenome: 'Souza',
      tipo: 'gestor',
      email: 'maria.souza@teste.com',
      senha: '123'
    }, 
    {
      id: 3,
      nome: 'Carlos',
      sobrenome: 'Oliveira',
      tipo: 'tecnico',
      email: 'carlos.oliveira@teste.com',
      senha: '123'
    }
  ],
  produtos: [
    {
      id: 1,
      modelo: 'Gen2 Premier MRL',
      imagem: 'produtos/elevador01.jpg',
      tipo: 'elevador'
    }
  ],
  pecas: [
    {
      id: 1,
      nome: 'Pino de conexão'
    }
  ],
  contratos: [
    {
      id: 'CT-2026-5427',
      idProduto: 1,
      idCliente: 1,
      statusOperacional: 'Ativo',
      produtoApelido: 'Elevador Principal',
      ultimaManutencao: '2026-03-15',
      localizacao: {
        logradouro: 'Avenida Teste',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000',
        apelido: 'Escritório',
        tipo: 'Comercial',
      }
    }
  ],
  ocorrencias: [
    {
      id: 1,
      descricao: 'Elevador parou de funcionar por mal contato em pino de conexão.',
      status: 'Finalizada',
      categoria: 'Elevador parado',
      contratoId: 'CT-2026-5427',
      atendimentos: [
        {
          tecnicoId: 3,
          relatorio: 'Algo aconteceu.',
          dataHoraInicioAtendimento: '2026-03-15T10:00:00',
          dataHoraFimAtendimento: '2026-03-15T12:00:00',
          pecasUtilizadas: [{id: 1, quantidade: 2}]
        }
      ],
      avaliacao: {
        nota: 5,
        comentario: 'Muito bom e rápido'
      }
    }
  ]
}

class Database {
  constructor(dadosIniciais = {}) {
    this.dados = { ...dadosIniciais };
  }
}

const db = new Database(mockDb);
export default db;
