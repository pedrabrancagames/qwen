# Design Document - Painel Administrativo Ghost Squad

## Overview

O painel administrativo será uma aplicação web separada que se conecta ao mesmo banco de dados Firebase Realtime Database usado pelo jogo Ghost Squad. A aplicação será construída como uma Single Page Application (SPA) usando HTML, CSS e JavaScript vanilla, mantendo consistência com a arquitetura atual do projeto.

A interface será responsiva e moderna, utilizando um design limpo e intuitivo que permita aos administradores gerenciar eficientemente todos os aspectos do jogo e sua base de usuários.

## Architecture

### Estrutura de Arquivos
```
admin/
├── index.html                 # Página principal do painel
├── admin-style.css           # Estilos específicos do painel
├── admin-main.js             # Controlador principal
├── modules/
│   ├── admin-auth.js         # Gerenciamento de autenticação admin
│   ├── user-manager.js       # Gerenciamento de usuários
│   ├── stats-manager.js      # Estatísticas e métricas
│   ├── config-manager.js     # Configurações do jogo
│   └── audit-manager.js      # Logs e auditoria
├── components/
│   ├── dashboard.js          # Componente do painel principal
│   ├── user-list.js          # Lista de usuários
│   ├── user-detail.js        # Detalhes do usuário
│   └── charts.js             # Gráficos e visualizações
└── assets/
    ├── icons/                # Ícones da interface
    └── images/               # Imagens do painel
```

### Conexão com Firebase
- Utiliza a mesma configuração Firebase do jogo principal
- Acesso ao Realtime Database para leitura/escrita de dados
- Sistema de autenticação separado para administradores
- Implementação de regras de segurança específicas para admins

## Components and Interfaces

### 1. Sistema de Autenticação Administrativa

**AdminAuthManager**
```javascript
class AdminAuthManager {
    constructor(firebaseConfig)
    authenticateAdmin(email, password)
    checkAdminPrivileges(user)
    logout()
    onAuthStateChanged(callback)
}
```

**Funcionalidades:**
- Login específico para administradores usando Firebase Auth
- Verificação de privilégios através de custom claims ou lista de emails autorizados
- Sessão segura com timeout automático
- Redirecionamento automático se não autenticado

### 2. Gerenciador de Usuários

**UserManager**
```javascript
class UserManager {
    constructor(database)
    getAllUsers(page, limit)
    getUserById(uid)
    updateUserPoints(uid, points)
    banUser(uid)
    unbanUser(uid)
    searchUsers(query)
    exportUserData()
}
```

**Funcionalidades:**
- Lista paginada de todos os usuários
- Busca e filtros avançados
- Edição de pontos e estatísticas
- Sistema de banimento/desbloqueio
- Exportação de dados em CSV/JSON

### 3. Gerenciador de Estatísticas

**StatsManager**
```javascript
class StatsManager {
    constructor(database)
    getDashboardMetrics()
    getActivityCharts(period)
    getLocationStats()
    getTopPlayers(limit)
    generateReport(filters)
}
```

**Funcionalidades:**
- Métricas em tempo real do dashboard
- Gráficos de atividade e engajamento
- Estatísticas por localização
- Rankings e leaderboards
- Relatórios personalizados

### 4. Gerenciador de Configurações

**ConfigManager**
```javascript
class ConfigManager {
    constructor(database)
    getGameConfig()
    updateGameConfig(config)
    getLocations()
    addLocation(location)
    removeLocation(locationId)
    updateLocation(locationId, data)
}
```

**Funcionalidades:**
- Configurações globais do jogo
- Gerenciamento de localizações de caça
- Parâmetros de gameplay (pontos, limites, etc.)
- Aplicação de mudanças em tempo real

### 5. Sistema de Auditoria

**AuditManager**
```javascript
class AuditManager {
    constructor(database)
    logAction(adminId, action, details)
    getAuditLogs(filters)
    getSystemLogs()
    getActiveAdmins()
}
```

**Funcionalidades:**
- Registro de todas as ações administrativas
- Logs de sistema e erros
- Rastreamento de administradores ativos
- Histórico completo de mudanças

## Data Models

### Estrutura de Dados do Firebase

**Usuários (/users/{uid})**
```javascript
{
  displayName: string,
  email: string,
  points: number,
  captures: number,
  level: number,
  inventory: array,
  ecto1Unlocked: boolean,
  createdAt: timestamp,
  lastActive: timestamp,
  status: "active" | "banned",
  banReason: string (opcional)
}
```

**Configurações do Jogo (/gameConfig)**
```javascript
{
  ghostPoints: {
    common: number,
    strong: number
  },
  inventoryLimit: number,
  captureRadius: number,
  captureDuration: {
    common: number,
    strong: number
  },
  ecto1UnlockCount: number
}
```

**Localizações (/locations)**
```javascript
{
  locationId: {
    name: string,
    lat: number,
    lon: number,
    active: boolean,
    description: string
  }
}
```

**Logs de Auditoria (/auditLogs)**
```javascript
{
  logId: {
    adminId: string,
    adminEmail: string,
    action: string,
    targetUserId: string (opcional),
    details: object,
    timestamp: timestamp,
    ipAddress: string
  }
}
```

**Administradores (/admins)**
```javascript
{
  adminId: {
    email: string,
    name: string,
    role: "admin" | "superadmin",
    createdAt: timestamp,
    lastLogin: timestamp,
    permissions: array
  }
}
```

## Error Handling

### Estratégias de Tratamento de Erros

1. **Erros de Autenticação**
   - Mensagens claras para credenciais inválidas
   - Redirecionamento automático para login
   - Bloqueio temporário após tentativas falhadas

2. **Erros de Conexão Firebase**
   - Retry automático com backoff exponencial
   - Modo offline com sincronização posterior
   - Indicadores visuais de status de conexão

3. **Erros de Validação**
   - Validação client-side em tempo real
   - Mensagens de erro contextuais
   - Prevenção de submissão de dados inválidos

4. **Erros de Permissão**
   - Verificação de privilégios antes de ações críticas
   - Mensagens informativas sobre limitações
   - Log de tentativas de acesso não autorizado

### Sistema de Notificações
```javascript
class NotificationSystem {
    showSuccess(message)
    showError(message)
    showWarning(message)
    showInfo(message)
    showConfirmation(message, callback)
}
```

## Testing Strategy

### Testes Unitários
- Testes para cada módulo/classe principal
- Mocks do Firebase para testes isolados
- Cobertura mínima de 80% do código

### Testes de Integração
- Testes de fluxo completo de autenticação
- Testes de operações CRUD no Firebase
- Testes de sincronização de dados

### Testes de Interface
- Testes de responsividade em diferentes dispositivos
- Testes de acessibilidade (WCAG 2.1)
- Testes de usabilidade com administradores

### Testes de Segurança
- Testes de autorização e privilégios
- Testes de injeção e XSS
- Testes de rate limiting

### Ambiente de Testes
```javascript
// Configuração de teste
const testConfig = {
  firebase: {
    // Configuração do Firebase para testes
    databaseURL: "https://test-ghostbusters.firebaseio.com"
  },
  mockData: {
    users: [...],
    admins: [...],
    gameConfig: {...}
  }
}
```

## Interface Design Patterns

### Layout Responsivo
- Design mobile-first
- Breakpoints: 768px (tablet), 1024px (desktop)
- Grid system flexível
- Navegação adaptativa

### Componentes Reutilizáveis
- Botões padronizados
- Modais e overlays
- Tabelas com paginação
- Formulários com validação
- Cards informativos

### Tema Visual
- Paleta de cores consistente com o jogo
- Tipografia legível e hierárquica
- Ícones intuitivos e reconhecíveis
- Animações sutis e funcionais

### Acessibilidade
- Suporte a leitores de tela
- Navegação por teclado
- Contraste adequado de cores
- Textos alternativos para imagens