# Deployment e Setup

## Requisitos do Sistema

### Desenvolvimento
- **Node.js** v14 ou superior
- **npm** v6 ou superior
- **Git** para controle de versão
- Editor de código (VS Code recomendado)

### Produção
- Servidor web compatível com arquivos estáticos
- Conexão com a internet
- SSL/TLS (recomendado para recursos de localização e câmera)

## Configuração do Ambiente de Desenvolvimento

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd ghostbusters---mais-fantasmas
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Firebase
1. Criar um projeto no Firebase Console
2. Obter as credenciais do projeto
3. Atualizar as configurações no código (arquivos que importam do Firebase)

### 4. Configurar Variáveis de Ambiente
Criar um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
FIREBASE_API_KEY=sua-api-key
FIREBASE_AUTH_DOMAIN=seu-auth-domain
FIREBASE_DATABASE_URL=sua-database-url
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_STORAGE_BUCKET=seu-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
FIREBASE_APP_ID=sua-app-id
```

## Estrutura do Projeto

```
ghostbusters---mais-fantasmas/
├── assets/                 # Recursos multimídia
│   ├── audio/              # Arquivos de áudio
│   ├── images/             # Imagens e logos
│   └── models/             # Modelos 3D (GLTF/GLB)
├── docs/                   # Documentação do projeto
├── admin/                  # Painel administrativo
├── tests/                  # Testes automatizados
├── *.js                    # Módulos principais
├── *.html                  # Arquivos HTML
├── *.css                   # Arquivos de estilo
├── package.json            # Configurações do projeto
├── package-lock.json       # Lockfile das dependências
└── .gitignore              # Arquivos ignorados pelo Git
```

## Comandos NPM

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm start

# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm test -- --coverage
```

### Build
```bash
# Build para produção (se configurado)
npm run build
```

## Configuração do Firebase

### 1. Criar Projeto
1. Acessar o Firebase Console
2. Criar novo projeto
3. Ativar os seguintes serviços:
   - Authentication
   - Realtime Database
   - Storage (se necessário)

### 2. Configurar Authentication
1. Na seção Authentication, habilitar:
   - Google Sign-In
   - Email/Password
   - Anonymous

### 3. Configurar Realtime Database
1. Criar regras de segurança apropriadas
2. Estruturar o banco de dados conforme necessário

### 4. Configurar Regras de Segurança
Exemplo de regras básicas para Realtime Database:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "locations": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    },
    "rankings": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Deployment

### Opções de Hosting

#### 1. Firebase Hosting (Recomendado)
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar Firebase no projeto
firebase init

# Deploy
firebase deploy
```

#### 2. GitHub Pages
1. Criar branch `gh-pages`
2. Configurar GitHub Actions para build e deploy automático
3. Ou fazer deploy manual copiando arquivos

#### 3. Servidor Web Tradicional
1. Copiar todos os arquivos para o servidor web
2. Configurar servidor para servir arquivos estáticos
3. Garantir que CORS esteja configurado corretamente

### Configurações Pós-Deployment

#### 1. Verificar Conexão com Firebase
- Confirmar que as credenciais estão corretas
- Testar autenticação
- Verificar acesso ao banco de dados

#### 2. Configurar Domínio Personalizado (Opcional)
- Adicionar domínio personalizado no serviço de hosting
- Configurar DNS apropriadamente
- Adicionar certificado SSL se necessário

#### 3. Configurar Analytics (Opcional)
- Adicionar Google Analytics ou outra solução de analytics
- Configurar eventos de tracking importantes

## Configuração do Painel Administrativo

### 1. Deploy Separado
O painel administrativo está localizado na pasta `admin/` e deve ser deployado separadamente ou como parte da mesma aplicação.

### 2. Configurar Acesso Administrativo
1. Criar usuários administradores no Firebase Authentication
2. Adicionar entradas no caminho `admins` no Realtime Database:
```json
{
  "admins": {
    "user-uid-1": true,
    "user-uid-2": true
  }
}
```

### 3. Configurar Regras de Segurança
As regras devem permitir acesso administrativo apenas para usuários autorizados:
```json
{
  "rules": {
    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    }
  }
}
```

## Performance e Otimização

### 1. Minificação
- Utilizar bundlers como Webpack ou Rollup para produção
- Minificar CSS e JavaScript
- Otimizar imagens e modelos 3D

### 2. Cache
- Configurar cabeçalhos de cache apropriados
- Utilizar CDN para recursos estáticos
- Implementar estratégias de cache service worker (PWA)

### 3. Lazy Loading
- Carregar módulos apenas quando necessários
- Carregar modelos 3D sob demanda
- Implementar code splitting

## Segurança

### 1. HTTPS
- Garantir que todo o tráfego seja criptografado
- Utilizar certificados SSL/TLS válidos

### 2. Content Security Policy
- Configurar CSP apropriada para prevenir XSS
- Restringir origens de scripts e recursos

### 3. Proteção contra Abusos
- Implementar rate limiting no Firebase
- Validar todas as entradas do usuário
- Monitorar atividades suspeitas

## Monitoramento e Logging

### 1. Erros do Cliente
- Implementar tratamento global de erros
- Registrar erros em serviço de logging
- Monitorar métricas de performance

### 2. Analytics
- Configurar eventos de tracking importantes
- Monitorar conversão de usuários
- Analisar comportamento do usuário

### 3. Monitoramento do Servidor
- Monitorar disponibilidade do serviço
- Verificar latência de APIs
- Alertas para falhas críticas

## Backup e Recuperação

### 1. Backup do Firebase
- Configurar backups automáticos do Realtime Database
- Exportar dados regularmente
- Testar procedimentos de restauração

### 2. Controle de Versão
- Manter todo o código no Git
- Utilizar tags para releases
- Documentar mudanças importantes

## Troubleshooting

### Problemas Comuns

#### 1. Erros de CORS
**Sintoma**: Recursos não carregam
**Solução**: Verificar configurações do servidor web

#### 2. Problemas com Firebase
**Sintoma**: Autenticação falha ou dados não carregam
**Solução**: Verificar credenciais e regras de segurança

#### 3. Problemas de Performance
**Sintoma**: Aplicação lenta
**Solução**: Otimizar assets, implementar lazy loading

#### 4. Problemas com AR
**Sintoma**: Realidade aumentada não funciona
**Solução**: Verificar permissões, compatibilidade do dispositivo

## Atualizações e Manutenção

### 1. Atualização de Dependências
```bash
npm outdated
npm update
```

### 2. Migrações
- Documentar mudanças que requerem migração de dados
- Criar scripts de migração quando necessário
- Testar migrações em ambiente de staging

### 3. Versionamento
- Seguir versionamento semântico
- Criar releases no GitHub para cada versão estável
- Manter changelog atualizado