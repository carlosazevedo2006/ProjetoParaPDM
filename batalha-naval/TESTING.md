# 🧪 Guia de Testes - Batalha Naval

## Testes Manuais

### Teste 1: Fluxo Completo do Jogo (Local)

#### Passo 1: Tela de Lobby
1. Iniciar a aplicação
2. Verificar que a tela de Lobby aparece
3. Inserir "Jogador 1" no primeiro campo
4. Inserir "Jogador 2" no segundo campo
5. Clicar em "Iniciar Jogo"
6. ✅ Deve navegar para a tela de Setup

#### Passo 2: Setup - Jogador 1
1. Verificar que o título mostra "Colocação de Navios"
2. Verificar que mostra "Jogador 1"
3. Verificar lista de navios a colocar (0/5)
4. Clicar em "🎲 Colocação Aleatória"
5. ✅ Deve mostrar alerta "Sucesso"
6. ✅ Deve mostrar navios no tabuleiro (células cinzentas)
7. ✅ Lista deve mostrar 5/5 navios
8. Verificar que todos os navios estão marcados com ✓
9. Clicar em "Próximo Jogador"
10. ✅ Deve mostrar alerta para Jogador 2

#### Passo 3: Setup - Jogador 2
1. Confirmar alerta
2. Verificar que agora mostra "Jogador 2"
3. Verificar tabuleiro vazio
4. Clicar em "🎲 Colocação Aleatória"
5. ✅ Navios devem aparecer no tabuleiro
6. Clicar em "Iniciar Jogo"
7. ✅ Deve mostrar alerta "Jogo Pronto!"
8. Confirmar
9. ✅ Deve navegar para tela de Jogo

#### Passo 4: Jogo - Primeiro Turno
1. Verificar indicador de turno (deve mostrar "Jogador 1")
2. Verificar dois tabuleiros:
   - "Meu Oceano 🌊" (com navios visíveis)
   - "Radar do Inimigo 🎯" (sem navios visíveis)
3. Tocar numa célula do Radar do Inimigo
4. ✅ Deve mostrar resultado
5. ✅ Turno deve alternar para "Jogador 2"

## ✅ Funcionalidades Implementadas

### Interface
- [x] Tela de Lobby funcional
- [x] Tela de Setup com lista de navios
- [x] Tela de Jogo com dois tabuleiros
- [x] Tela de Resultados com estatísticas
- [x] Navegação entre telas

### Mecânicas
- [x] Colocação aleatória de navios
- [x] Validação de colocação (sem sobreposição/contacto)
- [x] Sistema de turnos alternados
- [x] Disparo em células
- [x] Detecção de acerto/água/afundado
- [x] Detecção de fim de jogo
- [x] Cálculo de estatísticas
