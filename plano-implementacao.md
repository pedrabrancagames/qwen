# Plano de Implementação: Melhorias Ghost Squad

Este plano descreve a implementação das melhorias compatíveis de `Melhorias.md` que funcionam dentro das restrições do GitHub Pages e Firebase Free Tier. As melhorias são organizadas por prioridade e categorizadas por área de funcionalidade.

## Prioridade 1: Melhorias de Alto Impacto, Baixa Complexidade

### 1. Aprimoramentos Visuais/UI

#### Tarefa 1.1: Animações de Partículas para Tela de Login
- [x] Adicionar efeitos de partículas de ectoplasma ao fundo da tela de login
- [x] Implementar usando o sistema existente `login-background.js`
- [x] Garantir otimização de performance para dispositivos móveis

#### Tarefa 1.2: Animação de Carregamento Personalizada do Proton Pack
- [ ] Substituir a barra de progresso atual por visualização animada do proton pack
- [ ] Implementar em `ui-manager.js` e `animations.js`
- [ ] Adicionar estilos CSS correspondentes em `style.css`

#### Tarefa 1.3: Animações de Status do Inventário
- [ ] Adicionar feedback visual quando o inventário estiver cheio (piscando vermelho)
- [ ] Implementar na função updateInventoryUI de `ui-manager.js`
- [ ] Adicionar animações CSS para estados de alerta

#### Tarefa 1.4: Redesign do HUD
- [ ] Implementar HUD estilo medidor PKE circular
- [ ] Substituir ícones estáticos atuais por elementos animados
- [ ] Atualizar estrutura `index.html` e estilização `style.css`

### 2. Melhorias no Sistema de Notificações

#### Tarefa 2.1: Notificações Contextuais de Personagens
- [ ] Adicionar notificações em balões de fala com vozes de personagens
- [ ] Implementar em `notifications.js`
- [ ] Adicionar estilização específica por personagem em `style.css`

#### Tarefa 2.2: Emblemas Animados de Conquistas
- [ ] Criar sistema de emblemas animados para conquistas
- [ ] Implementar UI estilo cartões colecionáveis para conquistas
- [ ] Adicionar a `notifications.js` e criar novo `achievements.js`

### 3. Aprimoramentos de UX Mobile

#### Tarefa 3.1: Suporte a Gestos Multi-toque
- [ ] Implementar pinça para zoom no mapa
- [ ] Adicionar gestos de deslize para alternar entre modos
- [ ] Implementar em `ui-manager.js` com ouvintes de eventos touch

## Prioridade 2: Melhorias de Complexidade Média

### 4. Aprimoramentos de Efeitos Visuais/AR

#### Tarefa 4.1: Efeitos de Feixe de Prótons 3D
- [ ] Substituir animação de captura atual por feixe volumétrico
- [ ] Implementar em `visual-effects.js`
- [ ] Adicionar sistema de partículas usando componentes A-Frame

#### Tarefa 4.2: Efeitos de Armadilhas Animadas
- [ ] Adicionar animações de abertura de armadilhas 3D com efeitos de luz
- [ ] Criar nova entidade de armadilha em `index.html`
- [ ] Implementar lógica de animação em `ar-manager.js`

#### Tarefa 4.3: Efeitos de Celebração de Captura de Fantasmas
- [ ] Adicionar efeitos de partículas para capturas bem-sucedidas
- [ ] Implementar em `visual-effects.js`
- [ ] Coordenar com efeitos sonoros de captura existentes

### 5. Sistema de Progressão do Jogo

#### Tarefa 5.1: Sistema de Ranks de Caçador
- [ ] Adicionar progressão de rank (Novato → Lendário)
- [ ] Implementar na função updateUserStats de `game-state.js`
- [ ] Adicionar exibição de rank à UI em `ui-manager.js`

#### Tarefa 5.2: Sistema de Upgrade de Equipamentos
- [ ] Implementar upgrades do Proton Pack Mk II, III, IV
- [ ] Adicionar às userStats em `game-state.js`
- [ ] Criar UI para seleção de equipamentos no inventário

### 6. Modos de Jogo Adicionais

#### Tarefa 6.1: Modo Time Attack
- [ ] Implementar modo de captura de fantasmas baseado em temporizador
- [ ] Adicionar ao gerenciamento de estado do jogo
- [ ] Criar novos elementos de UI para exibição do temporizador

#### Tarefa 6.2: Modo Sobrevivência
- [ ] Adicionar spawn contínuo de ondas de fantasmas
- [ ] Implementar sistema de dificuldade crescente
- [ ] Adicionar seleção do modo sobrevivência à tela de localização

## Prioridade 3: Recursos Avançados

### 7. Melhorias no Comportamento dos Fantasmas

#### Tarefa 7.1: Sistema de Tipos de Fantasmas
- [ ] Implementar fantasmas de fogo (vermelhos), gelo (azuis), trevas (invisíveis)
- [ ] Adicionar comportamentos específicos por tipo em `game-state.js`
- [ ] Atualizar modelos de fantasmas em `index.html` e arquivos de assets

#### Tarefa 7.2: IA Básica de Fantasmas
- [ ] Adicionar padrões de comportamento simples (aproximar/evitar jogador)
- [ ] Implementar na função tick de `ar-manager.js`
- [ ] Adicionar aos componentes de entidade de fantasmas no A-Frame

### 8. Efeitos de Ambiente Dinâmico

#### Tarefa 8.1: Sistema de Névoa Ectoplásmica
- [ ] Adicionar névoa baseada em partículas que afeta a visibilidade
- [ ] Implementar em `visual-effects.js`
- [ ] Adicionar controles de densidade de névoa baseados em eventos do jogo

#### Tarefa 8.2: Iluminação Dinâmica
- [ ] Implementar mudanças de iluminação conforme a hora do dia
- [ ] Adicionar aos componentes de iluminação da cena A-Frame
- [ ] Coordenar com o horário real usando API Date do JavaScript

### 9. Sistema de Conquistas

#### Tarefa 9.1: Conquistas Baseadas em Categoria
- [ ] Implementar conquistas de captura, tipo, localização, tempo e sociais
- [ ] Adicionar às userStats em `game-state.js`
- [ ] Criar rastreamento de conquistas em novo `achievements.js`

#### Tarefa 9.2: Sistema de Eventos Sazonais
- [ ] Implementar progressão de battle pass
- [ ] Adicionar suporte a eventos temáticos (Halloween, Natal, etc.)
- [ ] Criar tipos de fantasmas e recompensas específicas para eventos

## Diretrizes de Implementação

### Considerações Técnicas
1. Todos os recursos devem ser implementados usando JavaScript do lado do cliente
2. O uso do Firebase deve permanecer dentro dos limites do tier gratuito (100 conexões, 1GB de armazenamento)
3. Os assets devem ser otimizados para performance mobile
4. Todos os novos recursos devem se degradar gracefulmente em dispositivos mais antigos

### Otimização de Performance
1. Implementar pooling de objetos para efeitos de partículas
2. Usar sistemas de level-of-detail (LOD) para modelos 3D
3. Aplicar frustum culling para elementos fora da tela
4. Comprimir todos os assets adequadamente

### Requisitos de Teste
1. Testar em múltiplos tipos de dispositivo (mobile, tablet, desktop)
2. Verificar performance em dispositivos de baixo custo
3. Garantir compatibilidade com vários navegadores
4. Validar que o uso do Firebase permaneça dentro dos limites

## Estimativa de Cronograma

### Fase 1 (Semanas 1-3): Recursos de Prioridade 1
- [ ] Aprimoramentos visuais/UI
- [ ] Melhorias de notificações
- [ ] Recursos de UX mobile

### Fase 2 (Semanas 4-7): Recursos de Prioridade 2
- [ ] Efeitos visuais/AR
- [ ] Sistema de progressão
- [ ] Modos de jogo adicionais

### Fase 3 (Semanas 8-12): Recursos de Prioridade 3
- [ ] Melhorias no comportamento dos fantasmas
- [ ] Efeitos de ambiente dinâmico
- [ ] Sistema de conquistas

## Métricas de Sucesso
1. Manter <100 conexões simultâneas no Firebase
2. Manter tempo de carregamento da página abaixo de 3 segundos
3. Alcançar 60fps em dispositivos móveis de médio porte
4. Manter compatibilidade com todos os principais navegadores