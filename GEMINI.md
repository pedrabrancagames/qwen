# Ghost Squad - Ghostbusters AR Game

## Projeto

Este é um jogo de realidade aumentada (AR) baseado no universo Ghostbusters, onde os jogadores capturam fantasmas em locais do mundo real usando seus dispositivos móveis. O jogo utiliza tecnologias web modernas, incluindo A-Frame para AR, Firebase para autenticação e banco de dados em tempo real, e Leaflet para mapas.

## Estrutura do Projeto

```
ghostbusters---mais-fantasmas/
├── assets/                 # Recursos do jogo (modelos 3D, imagens, áudio)
├── tests/                  # Arquivos de teste
├── *.js                    # Arquivos principais do jogo
├── *.html/.css             # Arquivos de interface
├── package.json            # Configuração do projeto Node.js
└── QWEN.md                 # Este arquivo
```

### Arquivos Principais

1. **main.js** - Ponto de entrada principal do jogo, contém o componente `game-manager` do A-Frame
2. **index.html** - Estrutura HTML do jogo com cena A-Frame e elementos de UI
3. **style.css** - Estilos visuais do jogo
4. **auth-manager.js** - Gerenciamento de autenticação com Firebase
5. **game-state.js** - Gerenciamento do estado do jogo (inventário, pontos, etc.)
6. **ar-manager.js** - Gerenciamento de elementos de realidade aumentada
7. **ui-manager.js** - Gerenciamento da interface do usuário
8. **map-manager.js** - Gerenciamento do mapa e localização
9. **qr-manager.js** - Gerenciamento do scanner de QR Code
10. **rankings.js** - Sistema de rankings dos jogadores
11. **visual-effects.js** - Sistema de efeitos visuais em canvas
12. **animations.js** - Sistema de animações CSS/JS
13. **notifications.js** - Sistema de notificações
14. **login-background.js** - Efeito de partículas na tela de login

## Tecnologias

- **A-Frame** - Framework de realidade virtual/AR para web
- **Firebase** - Autenticação e banco de dados em tempo real
- **Leaflet** - Biblioteca de mapas interativos
- **HTML5 QR Code** - Scanner de QR Code
- **Jest** - Framework de testes
- **Babel** - Transpilação de JavaScript

## Funcionalidades Principais

1. **Autenticação de Usuários**
   - Login com Google
   - Login como visitante
   - Registro/login com email

2. **Realidade Aumentada**
   - Posicionamento de objetos 3D (fantasmas) no mundo real
   - Hit testing para interação com superfícies
   - Modelos 3D animados de fantasmas

3. **Sistema de Captura**
   - Localização de fantasmas próximos via GPS
   - Mecânica de captura com duração variável
   - Inventário limitado de fantasmas capturados

4. **Mapa e Localização**
   - Integração com OpenStreetMap via Leaflet
   - Visualização da posição do jogador
   - Marcadores para fantasmas e veículos especiais

5. **Sistema de Pontuação**
   - Pontos por fantasmas capturados
   - Sistema de níveis e desbloqueios
   - Rankings de jogadores

6. **Depósito de Fantasmas**
   - Scanner de QR Code para unidade de contenção
   - Visualização de rankings

## Como Executar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch
```

### Build e Deploy

Como este é um projeto web estático, basta servir os arquivos HTML/CSS/JS através de um servidor web.

## Arquitetura

### Componentes Principais

1. **Game Manager (A-Frame Component)**
   - Componente principal que orquestra todos os outros sistemas
   - Gerencia o ciclo de vida do jogo
   - Coordena interações entre módulos

2. **Auth Manager**
   - Gerencia autenticação com Firebase
   - Sincroniza dados do usuário com o banco de dados

3. **Game State Manager**
   - Mantém o estado do jogo em memória
   - Gerencia inventário, pontos e desbloqueios

4. **AR Manager**
   - Controla elementos de realidade aumentada
   - Gerencia posicionamento de objetos 3D

5. **UI Manager**
   - Controla todos os elementos da interface
   - Gerencia transições entre telas

6. **Map Manager**
   - Integra com Leaflet para exibição de mapas
   - Gerencia marcadores e posição do jogador

7. **QR Manager**
   - Controla o scanner de QR Code
   - Valida códigos para depósito de fantasmas

8. **Rankings Manager**
   - Exibe rankings de jogadores
   - Busca dados do Firebase

### Sistemas de Efeitos Visuais

1. **Visual Effects System**
   - Sistema de partículas em canvas
   - Efeitos de captura, sucção e celebração

2. **Animation Manager**
   - Sistema de animações CSS/JS
   - Animações pré-definidas para elementos do jogo

3. **Notification System**
   - Sistema de notificações toast
   - Diferentes tipos de notificações (sucesso, erro, etc.)

4. **Login Background Effect**
   - Efeito de partículas flutuantes na tela de login

## Testes

Os testes são implementados com Jest e utilizam mocks para:
- Firebase (auth e database)
- HTML5 QR Code
- Leaflet
- A-Frame

Para executar os testes:

```bash
npm test
```

## Convenções de Desenvolvimento

1. **Nomenclatura**
   - Variáveis e funções em camelCase
   - Classes em PascalCase
   - Constantes em UPPER_SNAKE_CASE

2. **Estrutura de Código**
   - Módulos ES6 com imports/exports
   - Classes para componentes complexos
   - Funções puras quando possível

3. **Estilização**
   - CSS com classes semânticas
   - Animações CSS para melhor performance
   - Responsividade para dispositivos móveis

4. **Gerenciamento de Estado**
   - Estados centralizados nos managers
   - Atualizações reativas através de listeners
   - Persistência em Firebase

## Problemas Conhecidos e Considerações

1. **Performance AR**
   - O jogo pode ser pesado em dispositivos mais antigos
   - Efeitos visuais são otimizados para balancear qualidade e performance

2. **Compatibilidade**
   - Requer navegador com suporte a WebXR
   - Necessita de permissões de câmera e localização

3. **Dependências Externas**
   - Confiante em serviços de terceiros (Firebase, OpenStreetMap)
   - Requer conexão com a internet para funcionalidades completas

## Futuras Melhorias

1. **Multiplayer**
   - Sessões cooperativas para caçar fantasmas em grupo
   - Competição em tempo real

2. **Eventos Especiais**
   - Fantasmas raros com mecânicas especiais
   - Eventos sazonais

3. **Personalização**
   - Equipamentos personalizáveis
   - Trajes e veículos alternativos

4. **Expansão de Conteúdo**
   - Mais tipos de fantasmas
   - Novas áreas de caça
   - Missões e desafios