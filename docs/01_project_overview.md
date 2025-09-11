# Visão Geral do Projeto Ghost Squad

## Descrição do Projeto

Ghost Squad é um jogo de realidade aumentada (AR) baseado no universo Ghostbusters, onde os jogadores se tornam caçadores de fantasmas em uma experiência interativa. O jogo combina elementos de localização (GPS), realidade aumentada e mecânicas de captura para criar uma experiência de jogo imersiva.

## Tecnologias Principais

- **A-Frame**: Framework para realidade virtual e aumentada na web
- **Firebase**: Backend como serviço para autenticação e armazenamento de dados
- **Leaflet**: Biblioteca para mapas interativos
- **HTML5 QR Code**: Biblioteca para leitura de QR Codes
- **JavaScript (ES6 Modules)**: Linguagem de programação principal
- **CSS3**: Para estilização e efeitos visuais

## Arquitetura do Sistema

O projeto segue uma arquitetura modular baseada em componentes, onde cada funcionalidade é encapsulada em módulos independentes:

```
ghostbusters---mais-fantasmas/
├── assets/                 # Recursos multimídia (modelos 3D, áudios, imagens)
├── docs/                   # Documentação do projeto
├── admin/                  # Painel administrativo
├── tests/                  # Testes automatizados
├── modules/                # Módulos principais do jogo
│   ├── auth-manager.js     # Gerenciamento de autenticação
│   ├── game-state.js       # Gerenciamento do estado do jogo
│   ├── ar-manager.js       # Gerenciamento de realidade aumentada
│   ├── ui-manager.js       # Gerenciamento da interface do usuário
│   ├── map-manager.js      # Gerenciamento de mapas e localização
│   ├── qr-manager.js       # Gerenciamento de QR Codes
│   └── rankings.js         # Sistema de rankings
├── index.html              # Ponto de entrada da aplicação
├── main.js                 # Componente principal do A-Frame
├── style.css               # Estilos globais
└── package.json            # Configurações do projeto
```

## Funcionalidades Principais

1. **Autenticação de Usuários**
   - Login com Google
   - Login com email e senha
   - Login como visitante

2. **Sistema de Localização**
   - Integração com GPS para rastreamento de posição
   - Mapas interativos com Leaflet
   - Seleção de áreas de caça

3. **Realidade Aumentada**
   - Posicionamento de objetos 3D no espaço real
   - Hit testing para interação com o ambiente
   - Animações e efeitos visuais

4. **Mecânicas de Jogo**
   - Captura de fantasmas
   - Inventário de fantasmas capturados
   - Sistema de pontos e rankings
   - Desbloqueio de veículos especiais (ECTO-1)

5. **Integração com QR Code**
   - Leitura de QR Codes para depósito de fantasmas
   - Validação de unidades de contenção

## Público-Alvo

O jogo é direcionado a fãs da franquia Ghostbusters e entusiastas de tecnologia que desejam experimentar uma aplicação inovadora que combina realidade aumentada com mecânicas de jogo de captura.

## Requisitos do Sistema

- Navegador web moderno com suporte a WebXR
- Dispositivo com câmera (para realidade aumentada e QR Code)
- Acesso ao GPS (para funcionalidades de localização)
- Conexão com a internet