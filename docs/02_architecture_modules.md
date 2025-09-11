# Arquitetura e Módulos Principais

## Estrutura Modular

O Ghost Squad utiliza uma arquitetura modular para manter o código organizado e facilitar a manutenção. Cada módulo é responsável por uma funcionalidade específica do sistema.

## Módulos Principais

### 1. AuthManager (auth-manager.js)

Responsável por gerenciar toda a autenticação de usuários no sistema.

**Principais funcionalidades:**
- Integração com Firebase Authentication
- Login com Google
- Login com email e senha
- Cadastro de novos usuários
- Login como visitante (usuário anônimo)
- Gerenciamento de estado de autenticação
- Salvamento e sincronização de dados do usuário

**Dependências:**
- Firebase Authentication
- Firebase Realtime Database

### 2. GameStateManager (game-state.js)

Gerencia o estado completo do jogo, incluindo inventário, pontos, níveis e desbloqueios.

**Principais funcionalidades:**
- Gerenciamento do inventário de fantasmas
- Controle de pontos e capturas do usuário
- Geração de dados para novos fantasmas
- Verificação de proximidade com objetos
- Gerenciamento de localizações de caça
- Controle de desbloqueio do ECTO-1

**Atributos importantes:**
- `userStats`: Estatísticas do usuário (pontos, capturas, nível)
- `inventory`: Inventário de fantasmas capturados
- `selectedLocation`: Localização atual selecionada
- `ghostData`: Dados do fantasma atual
- `ECTO1_POSITION`: Posição do veículo ECTO-1 no mapa

### 3. ARManager (ar-manager.js)

Controla todos os aspectos relacionados à realidade aumentada.

**Principais funcionalidades:**
- Configuração do hit testing para posicionamento de objetos
- Gerenciamento de entidades 3D (fantasmas, ECTO-1)
- Controle de animações dos objetos AR
- Posicionamento automático de objetos na cena
- Gerenciamento do reticle (indicador de posicionamento)

**Elementos gerenciados:**
- `ghostComumEntity`: Entidade do fantasma comum
- `ghostForteEntity`: Entidade do fantasma forte
- `ecto1Entity`: Entidade do veículo ECTO-1
- `reticle`: Indicador visual para posicionamento

### 4. UIManager (ui-manager.js)

Gerencia toda a interface do usuário e interações visuais.

**Principais funcionalidades:**
- Controle de telas e transições
- Gerenciamento de botões e elementos interativos
- Atualização da interface do inventário
- Controle da barra de progresso do Proton Pack
- Sistema de notificações
- Gerenciamento do menu AR
- Efeitos visuais e haptics

**Telas principais:**
- Tela de login
- Tela de seleção de localização
- Interface do jogo principal
- Modal de inventário
- Scanner de QR Code
- Modal de notificações

### 5. MapManager (map-manager.js)

Responsável pela integração com mapas e localização.

**Principais funcionalidades:**
- Inicialização e configuração do mapa Leaflet
- Atualização da posição do jogador
- Posicionamento de marcadores (fantasmas, ECTO-1)
- Cálculos de proximidade com objetos
- Verificação de distância entre jogador e objetos

**Elementos do mapa:**
- `playerMarker`: Marcador da posição do jogador
- `ghostMarker`: Marcador do fantasma atual
- `ecto1Marker`: Marcador do ECTO-1

### 6. QRManager (qr-manager.js)

Gerencia a funcionalidade de leitura de QR Codes para depósito de fantasmas.

**Principais funcionalidades:**
- Integração com a biblioteca HTML5 QR Code
- Inicialização do scanner de câmera
- Validação de QR Codes de unidades de contenção
- Controle do fluxo de depósito de fantasmas

**Constantes importantes:**
- `CONTAINMENT_UNIT_ID`: ID esperado para QR Code válido

### 7. RankingsManager (rankings.js)

Sistema de rankings dos jogadores.

**Principais funcionalidades:**
- Carregamento de rankings do Firebase
- Exibição de posições dos jogadores
- Destaque do usuário atual no ranking
- Interface de modal para visualização de rankings

## Integração entre Módulos

Os módulos se comunicam através do componente principal `game-manager` registrado no A-Frame. Este componente atua como um orquestrador, passando referências entre os módulos conforme necessário.

### Fluxo de Comunicação Principal:

```
1. main.js (game-manager) instancia todos os módulos
2. Os módulos recebem referências para outros módulos quando necessário
3. Eventos da interface são tratados pelo UIManager e encaminhados ao game-manager
4. O game-manager coordena as ações entre os diferentes módulos
5. Alterações de estado são propagadas de volta à interface através do UIManager
```

## Padrões de Design Utilizados

### 1. Módulos ES6
Todo o código é organizado em módulos ES6 para melhor encapsulamento e reutilização.

### 2. Programação Orientada a Objetos
Cada módulo é implementado como uma classe com métodos bem definidos.

### 3. Injeção de Dependências
As dependências entre módulos são injetadas no momento da inicialização.

### 4. Componentização
A interface é dividida em componentes reutilizáveis e independentes.

## Gerenciamento de Estado

O estado do jogo é centralizado no `GameStateManager`, que mantém as informações persistentes em sincronia com o Firebase Realtime Database. Isso garante que os dados do usuário estejam sempre atualizados entre diferentes sessões e dispositivos.

## Tratamento de Eventos

O sistema utiliza uma abordagem de delegação de eventos, onde o `game-manager` centraliza o tratamento de eventos importantes e os distribui para os módulos responsáveis.