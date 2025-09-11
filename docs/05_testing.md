# Testes e Estrutura de Testes

## Visão Geral

O Ghost Squad utiliza Jest como framework de testes, com jsdom como ambiente de teste para simular o DOM no ambiente Node.js. Os testes são organizados seguindo a estrutura do código fonte, com cada módulo principal possuindo seu arquivo de teste correspondente.

## Estrutura de Testes

```
tests/
├── __mocks__/              # Mocks para bibliotecas externas
├── admin/                  # Testes do painel administrativo
├── ar-manager.test.js      # Testes do ARManager
├── auth-manager.test.js    # Testes do AuthManager
├── game-state.test.js      # Testes do GameStateManager
├── map-manager.test.js     # Testes do MapManager
├── qr-manager.test.js      # Testes do QRManager
├── ui-manager.test.js      # Testes do UIManager
├── setupTests.js           # Configurações globais de teste
└── coverage/               # Relatórios de cobertura (gerado)
```

## Framework e Ferramentas

### Jest
Jest é o framework de testes principal, configurado no `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "collectCoverageFrom": [
      "*.js",
      "!main.js",
      "!visual-effects.js",
      "!animations.js",
      "!notifications.js"
    ],
    "transform": {
      "^.+\\.js$": "babel-jest"
    }
  }
}
```

### jsdom
Ambiente de teste que simula um navegador DOM, permitindo testar código que interage com elementos HTML sem precisar de um navegador real.

### Babel Jest
Transforma o código ES6+ para uma versão compatível com o ambiente de teste.

## Estratégia de Testes

### Testes Unitários
Cada módulo é testado isoladamente, verificando:
- Funções puras e seus retornos
- Manipulação de estado
- Tratamento de diferentes cenários (sucesso, erro, casos limite)

### Testes de Integração
Verificam a interação entre módulos e componentes.

### Cobertura de Código
Configurada para coletar cobertura de todos os arquivos JavaScript, exceto:
- `main.js` (componente A-Frame principal)
- `visual-effects.js` (efeitos visuais)
- `animations.js` (animações)
- `notifications.js` (sistema de notificações)

## Executando Testes

### Todos os Testes
```bash
npm test
```

### Modo Watch
Para desenvolvimento contínuo:
```bash
npm run test:watch
```

### Relatório de Cobertura
```bash
npm test -- --coverage
```

## Estrutura de um Arquivo de Teste

Os arquivos de teste seguem um padrão consistente:

```javascript
/** 
 * @jest-environment jsdom
 */

import { ModuleName } from '../module-name.js';

describe('ModuleName', () => {
    let module;
    
    beforeEach(() => {
        module = new ModuleName();
    });
    
    describe('methodName', () => {
        it('should do something', () => {
            // Test implementation
        });
    });
});
```

## Exemplo Detalhado: Testes do GameStateManager

O arquivo `game-state.test.js` demonstra as práticas de teste utilizadas:

### Configuração
```javascript
/** 
 * @jest-environment jsdom
 */

import { GameStateManager } from '../game-state.js';

describe('GameStateManager', () => {
    let gameState;

    beforeEach(() => {
        gameState = new GameStateManager();
    });
    // ...
});
```

### Teste de Método Específico
```javascript
describe('addGhostToInventory', () => {
    it('deve adicionar fantasma ao inventário quando houver espaço', () => {
        const ghost = { id: 1, type: 'Fantasma Comum', points: 10 };
        
        const result = gameState.addGhostToInventory(ghost);
        
        expect(result).toBe(true);
        expect(gameState.inventory).toContain(ghost);
    });

    it('não deve adicionar fantasma ao inventário quando estiver cheio', () => {
        // Preencher o inventário
        for (let i = 0; i < gameState.INVENTORY_LIMIT; i++) {
            gameState.inventory.push({ id: i, type: 'Fantasma', points: 10 });
        }
        
        const ghost = { id: 100, type: 'Fantasma Comum', points: 10 };
        const result = gameState.addGhostToInventory(ghost);
        
        expect(result).toBe(false);
        expect(gameState.inventory).not.toContain(ghost);
    });
});
```

## Mocks

### Mocks de Bibliotecas Externas
A pasta `__mocks__` contém mocks para bibliotecas externas que não funcionam bem no ambiente de teste:

```
__mocks__/
└── html5-qrcode.js         # Mock da biblioteca de QR Code
```

### Setup Global
O arquivo `setupTests.js` configura o ambiente de teste:

```javascript
// Mocks globais e configurações
global.HTML5QRCode = jest.fn();
// Outras configurações globais
```

## Boas Práticas de Teste

### 1. Nomeclatura Clara
- Usar descrições em português claro
- Nomes de testes descritivos do comportamento esperado
- Estrutura consistente: `descrição do método` → `comportamento esperado`

### 2. Isolamento
- Cada teste deve ser independente
- Usar `beforeEach` para reinicializar o estado
- Evitar dependências entre testes

### 3. Cobertura Abrangente
- Testar casos normais
- Testar casos de erro
- Testar casos limite
- Verificar valores de retorno
- Verificar mudanças de estado

### 4. Mocks Apropriados
- Mockar dependências externas
- Usar spies para verificar chamadas de métodos
- Criar mocks realistas para interações complexas

## Relatórios de Cobertura

Ao executar os testes com a opção de cobertura, o Jest gera relatórios detalhados em:
- `tests/coverage/lcov-report/index.html` (relatório HTML)
- `tests/coverage/coverage-final.json` (dados brutos)

### Métricas de Cobertura
- **Statements**: Porcentagem de declarações executadas
- **Branches**: Porcentagem de caminhos condicionais cobertos
- **Functions**: Porcentagem de funções chamadas
- **Lines**: Porcentagem de linhas de código executadas

## Integração Contínua

Os testes são configurados para serem executados em pipelines de CI/CD, garantindo que:
- Novas alterações não quebrem funcionalidades existentes
- A cobertura de código seja mantida em níveis aceitáveis
- Problemas sejam detectados antes do deployment

## Diretrizes para Novos Testes

### 1. Estrutura
```javascript
describe('funcionalidade', () => {
    beforeEach(() => {
        // Setup
    });
    
    it('deve fazer algo específico', () => {
        // Arrange (preparação)
        // Act (ação)
        // Assert (verificação)
    });
});
```

### 2. Organização
- Agrupar testes relacionados em blocos `describe`
- Manter testes focados em uma única responsabilidade
- Usar nomes descritivos que indiquem o comportamento esperado

### 3. Verificações
- Preferir `toBe` para valores primitivos
- Usar `toEqual` para objetos e arrays
- Utilizar `toHaveBeenCalledWith` para verificar chamadas de métodos
- Empregar `toThrow` para testar tratamento de erros

## Manutenção dos Testes

### Atualização
- Manter testes sincronizados com mudanças no código
- Adicionar testes para novas funcionalidades
- Remover testes obsoletos

### Refatoração
- Manter a clareza e legibilidade dos testes
- Extrair setup repetido para funções auxiliares
- Organizar testes de forma lógica e intuitiva