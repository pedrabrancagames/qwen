# Painel Administrativo

## Visão Geral

O painel administrativo do Ghost Squad permite que administradores gerenciem usuários, visualizem relatórios, configurem o jogo e monitorem a atividade do sistema. É uma aplicação web separada localizada na pasta `admin/`.

## Estrutura do Painel

```
admin/
├── assets/                 # Recursos multimídia
├── components/             # Componentes da interface
├── modules/                # Módulos de funcionalidades
├── admin-main.js           # Arquivo principal
├── admin-style.css         # Estilos
├── index.html              # Ponto de entrada
├── firebase-config.js      # Configuração do Firebase
└── DEPLOYMENT_GUIDE.md     # Guia de deployment
```

## Funcionalidades

### 1. Dashboard
- Visão geral das métricas do jogo
- Estatísticas em tempo real
- Resumo de atividades recentes

### 2. Gerenciamento de Usuários
- Listagem de todos os usuários
- Visualização de detalhes individuais
- Estatísticas de cada jogador
- Histórico de capturas

### 3. Relatórios e Estatísticas
- Relatórios de desempenho
- Análise de dados de jogo
- Gráficos e visualizações

### 4. Configurações do Jogo
- Configurações globais
- Parâmetros de dificuldade
- Ajustes de mecânicas

### 5. Gerenciamento de Localizações
- Cadastro de áreas de caça
- Geolocalização de pontos
- Ativação/desativação de locais

### 6. Logs e Auditoria
- Registro de atividades
- Monitoramento de eventos
- Logs de segurança

### 7. Logs do Sistema
- Erros e exceções
- Problemas técnicos
- Diagnóstico de falhas

## Autenticação Administrativa

### Requisitos para Acesso
1. Usuário deve ter conta no Firebase Authentication
2. Usuário deve ter privilégios administrativos registrados no banco de dados
3. Credenciais válidas (email e senha)

### Processo de Autenticação
1. Login através do formulário de autenticação
2. Verificação de credenciais no Firebase Authentication
3. Confirmação de privilégios administrativos no banco de dados
4. Redirecionamento para o dashboard em caso de sucesso

## Componentes Principais

### Módulos (modules/)

#### AdminAuthManager
- Gerenciamento de autenticação administrativa
- Verificação de privilégios
- Controle de sessão

#### UserManager
- Gerenciamento de usuários do jogo
- Operações CRUD
- Consultas e filtros

#### StatsManager
- Coleta e processamento de estatísticas
- Geração de relatórios
- Análise de dados

#### ConfigManager
- Gerenciamento de configurações
- Validação de parâmetros
- Persistência de configurações

#### AuditManager
- Registro de atividades
- Monitoramento de eventos
- Gerenciamento de logs

### Componentes (components/)

#### Dashboard
- Interface principal com métricas
- Visualizações em tempo real
- Resumo de informações

#### UserList
- Listagem de usuários
- Funcionalidades de busca e filtro
- Paginação de resultados

#### UserDetail
- Detalhes específicos de um usuário
- Histórico de atividades
- Estatísticas individuais

#### Reports
- Interface de relatórios
- Gráficos e visualizações
- Exportação de dados

#### Settings
- Interface de configurações
- Formulários de edição
- Validação de dados

#### Locations
- Gerenciamento de localizações
- Mapas interativos
- Formulários de cadastro

#### Logs
- Visualização de logs de auditoria
- Filtros e busca
- Detalhamento de eventos

#### SystemLogs
- Logs técnicos do sistema
- Registro de erros
- Diagnóstico de problemas

## Segurança

### Controle de Acesso
- Autenticação obrigatória para todas as funcionalidades
- Verificação de privilégios em todas as operações
- Sessões com tempo limite de expiração

### Proteção de Dados
- Validação de entrada em todos os formulários
- Sanitização de dados antes de persistir
- Restrições no Firebase Security Rules

### Monitoramento
- Registro completo de atividades administrativas
- Logs de acesso e modificações
- Alertas para atividades suspeitas

## Personalização

### Temas e Estilos
- CSS modular para fácil customização
- Variáveis para cores e tipografia
- Responsividade para diferentes dispositivos

### Extensibilidade
- Arquitetura em módulos independentes
- Interfaces bem definidas para novas funcionalidades
- Sistema de notificações para integração

## Manutenção

### Atualizações
- Processo de deployment documentado
- Scripts de migração de dados
- Controle de versão das configurações

### Monitoramento
- Dashboards de saúde do sistema
- Alertas automáticos para problemas
- Métricas de performance

### Backup
- Procedimentos de backup de dados
- Recuperação em caso de falhas
- Histórico de alterações