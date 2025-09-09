# Ghostbusters AR - Mais Fantasmas

## Visão Geral do Projeto

Este é um jogo de realidade aumentada (AR) baseado no universo Ghostbusters, onde os jogadores caçam fantasmas em locais do mundo real usando seus dispositivos móveis. O jogo utiliza tecnologia WebXR com A-Frame para a experiência de AR, Firebase para autenticação e armazenamento de dados, e Leaflet para o mapa de localização.

### Principais Tecnologias

- **A-Frame 1.5.0**: Framework para realidade aumentada e 3D na web
- **Firebase**: Autenticação de usuários e banco de dados em tempo real
- **Leaflet**: Biblioteca para mapas interativos
- **HTML5-QRCode**: Leitor de QR Code para interação com objetos do mundo real
- **Jest**: Framework de testes
- **Babel**: Transpilação de JavaScript

## Estrutura do Código

### Arquivos Principais

1. **index.html**: Ponto de entrada do aplicativo com:
   - Configuração da cena A-Frame
   - Interface do usuário (telas de login, seleção de local, inventário)
   - Elementos 3D para fantasmas e ECTO-1
   - Assets de áudio

2. **main.js**: Componente principal do A-Frame que gerencia:
   - Inicialização dos módulos
   - Estados do jogo
   - Integração com Firebase
   - Fluxo de captura de fantasmas

3. **Módulos de Gerenciamento**:
   - `auth-manager.js`: Autenticação de usuários (Google, email, anônimo)
   - `game-state.js`: Gerenciamento do estado do jogo (inventário, pontos, localizações)
   - `ar-manager.js`: Controles de realidade aumentada (posicionamento, hit testing)
   - `ui-manager.js`: Interface do usuário e interações
   - `map-manager.js`: Integração com mapas e localização
   - `qr-manager.js`: Leitura de QR Codes para depósito de fantasmas
   - `rankings.js`: Sistema de classificação de jogadores

4. **Sistemas Visuais**:
   - `visual-effects.js`: Efeitos visuais em canvas (partículas, animações)
   - `animations.js`: Animações CSS e JavaScript
   - `notifications.js`: Sistema de notificações estilizadas

## Funcionalidades Principais

### Autenticação
- Login com Google
- Login com email e senha
- Cadastro de novos usuários
- Modo visitante (anônimo)

### Caça aos Fantasmas
1. **Seleção de Local**: Jogadores escolhem entre locais pré-definidos
2. **Entrada em AR**: Acesso à câmera para experiência de realidade aumentada
3. **Navegação no Mapa**: Visualização da posição do jogador e marcadores
4. **Localização de Fantasmas**: Detecção de proximidade com fantasmas gerados aleatoriamente
5. **Captura**: Uso do Proton Pack (segurando o ícone) para capturar fantasmas
6. **Inventário**: Armazenamento de fantasmas capturados (limite de 5)
7. **Depósito**: Uso de QR Code para depositar fantasmas na unidade de contenção

### Recursos Especiais
- **ECTO-1**: Desbloqueável após 5 capturas
- **Tipos de Fantasmas**: Fantasmas Comuns (10 pontos) e Fantasmas Fortes (25 pontos)
- **Sistema de Pontuação**: Acúmulo de pontos por capturas
- **Classificações**: Ranking de jogadores por pontos

## Comandos de Desenvolvimento

### Testes
```bash
npm run test          # Executar todos os testes
npm run test:watch    # Executar testes em modo watch
```

### Build (se configurado)
Verificar scripts no `package.json` para comandos de build específicos.

## Convenções de Desenvolvimento

### Estrutura de Código
- Módulos ES6 para organização
- Classes para gerenciamento de funcionalidades específicas
- Componente A-Frame como ponto de entrada principal
- Separação clara entre lógica de negócios e interface

### Estilização
- CSS com classes específicas para efeitos visuais
- Animações CSS para transições suaves
- Canvas para efeitos visuais complexos (partículas)

### Padrões de Codificação
- Funções com nomes descritivos em português
- Comentários em português explicando funcionalidades complexas
- Tratamento de erros com mensagens amigáveis ao usuário
- Uso de constantes para valores configuráveis

## Considerações de Performance

- Limitação de partículas para evitar travamentos
- Otimização de animações CSS
- Uso de `requestAnimationFrame` para animações suaves
- Limpeza periódica de partículas e efeitos antigos

## Recursos Visuais

### Assets 3D
- `assets/models/ghost.glb`: Modelo de fantasma comum
- `assets/models/geleia.glb`: Modelo de fantasma forte

### Áudio
- `assets/audio/proton-beam.mp3`: Som do feixe de prótons
- `assets/audio/ghost-capture.mp3`: Som de captura bem-sucedida
- `assets/audio/inventory_full.mp3`: Som de inventário cheio

### Imagens
- `assets/images/logo.png`: Logo do jogo
- `assets/images/ghost_trap.png`: Ícone do inventário
- `assets/images/proton_pack.png`: Ícone do Proton Pack

## Fluxo de Jogo

1. **Login**: Autenticação do jogador
2. **Seleção de Área**: Escolha do local de caça
3. **Início da Caça**: Entrada em modo AR
4. **Busca**: Navegação pelo mapa em busca de fantasmas
5. **Captura**: Posicionamento do fantasma em AR e uso do Proton Pack
6. **Inventário**: Gerenciamento de fantasmas capturados
7. **Depósito**: Uso de QR Code para esvaziar inventário e ganhar pontos