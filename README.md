<p align="center" style="line-height: 0">
   <img src="public/smartlift-logo.png" height="60" />
</p>
<h1 align="center">SmartLift</h1>

> **Tecnologia que conecta, gestão que eleva.**

O **SmartLift** é uma plataforma digital desenvolvida para tornar o gerenciamento de manutenção de elevadores mais simples, rápido, transparente e organizado. A aplicação conecta **clientes**, **gestores** e **técnicos** em um único ambiente, centralizando chamados, atendimentos, indicadores operacionais e notificações.



## 📖 Visão Geral

Acesso por perfil na tela inicial, com rotas protegidas por autenticação e permissão (`ProtectedRoute`):

- **Portal do Cliente**: acompanhamento de chamados, abertura de novas ocorrências (com prioridade e anexos), consulta de equipamentos/contratos e central de notificações.
- **Portal do Gestor**: visão geral estratégica, gestão completa de ocorrências, gráficos e indicadores operacionais e central de notificações.
- **Portal do Técnico**: métricas em tempo real com destaque para SLA crítico, fila de atendimentos atribuídos, central de notificações e suporte operacional.
- **Detalhes da Ocorrência**: visualização completa do chamado, histórico de atendimentos e alterações, ações técnicas de status/relatório e avaliação com estrelas pelo cliente.



## 🔧 Tecnologias Utilizadas

Utilizamos toda a base de HTML, CSS e JS juntamente com as outras ferramentas que foram apresentadas durante o ano letivo. Algumas dessas ferramentas, são as que utilizamos aqui:

- **[React](https://react.dev/)** — construção da interface de usuário
- **[React Router](https://reactrouter.com/)** — roteamento SPA e proteção de rotas por perfil
- **[Styled Components](https://styled-components.com/)** — estilização modular e responsiva



## 💾 Persistência Local

A aplicação opera com uma base simulada (`src/db.js`) integrada ao `localStorage`, centralizada em três serviços com sincronização automática na mesma aba e entre abas:

| Serviço | Chave no `localStorage` | Responsabilidade |
| :--- | :--- | :--- |
| `UsuarioService` | `smartlift.usuarioLogado` | Persistência da sessão do usuário logado e limpeza no logout |
| `OcorrenciaService` | `smartlift.novasOcorrencias` | Cadastro de ocorrências, atualização de status, registros técnicos, histórico de alterações e avaliações |
| `NotificacaoService` | `smartlift.notificacoesLidas` | Controle de notificações lidas por usuário |



## 🧑🏻‍💻 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior recomendada)
- **npm**

### Passo a passo

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador:**
   Abra o endereço exibido no terminal (geralmente `http://localhost:5173`) e escolha um dos perfis disponíveis na tela de login:
   - **Cliente** — João Silva
   - **Gestor** — Maria Souza
   - **Técnico** — Carlos Oliveira



## 💪 Time

Esse projeto foi feito em colaboração entre 5 pessoas como grupo:

- Pedro Anuda
- Brunna Saraiva
- Ana Carolina
- Lucas Peixoto
- Thiago Neves
