# Especificação de Design: Cartinha de Amor Interativa

## 1. Visão Geral
Uma página web interativa, romântica e responsiva criada especialmente para a Rayane. A página apresenta um envelope realista e delicado que, ao ser clicado, abre com uma animação 3D suave, revelando uma foto do casal (`eu e ray.jpg`), um coração com a mensagem "Eu te amo" e uma explosão de partículas de corações flutuantes.

## 2. Objetivos e Requisitos
- **Interatividade:** O envelope é clicável e reativo ao toque / clique do mouse.
- **Animação Fluida:** Aba superior do envelope abre realisticamente em 3D, a cartinha desliza para fora e se expande em primeiro plano.
- **Efeito Visual Mágico:** Partículas de corações em tons de rosa e vermelho sobem e flutuam suavemente pelo fundo da tela ao abrir a carta.
- **Conteúdo Central:** Exibição da foto `eu e ray.jpg` com estilo refinado de moldura e um coração com animação de batimento contendo o texto *"Eu te amo"*.
- **Opção de Replay:** Um botão sutil permite fechar a carta para que a animação possa ser revivida quantas vezes desejar.
- **Responsividade:** Perfeita visualização e funcionamento em celulares (iOS/Android), tablets e desktops.

## 3. Arquitetura e Estrutura de Arquivos
- `index.html`: Marcação semântica com tags de acessibilidade, links de fontes Google Fonts (*Great Vibes* e *Poppins*), containers do envelope e canvas de partículas.
- `style.css`: Estilização moderna com variáveis CSS (cores HSL românticas), perspectiva 3D, transições com curvas de aceleração (*cubic-bezier*) e design responsivo.
- `script.js`: Gerenciamento do estado da carta (fechada/aberta), disparo do sistema de partículas no Canvas e controles de interação por clique/toque.
- `eu e ray.jpg`: Imagem fotográfica do casal localizada na raiz do projeto.

## 4. Componentes Detalhados

### 4.1 Cenário & Fundo
- Fundo com gradiente radial suave em tons pastel (`#ffeef2` a `#ffd6e0`).
- Canvas em tela cheia (`#hearts-canvas`) com partículas de coração que se movimentam organicamente com velocidade, rotação e opacidade variáveis.

### 4.2 Envelope 3D
- Caixa do envelope com textura suave, cantos ligeiramente arredondados e sombras suaves (`box-shadow`).
- Aba superior (`.flap`) com ponto de rotação no topo (`transform-origin: top center`) que gira 180 graus no eixo X.
- Selo de coração centralizado (`.seal`) com efeito pulsante convidativo antes de abrir.
- Texto auxiliar abaixo do envelope: *"Toque na cartinha para abrir ✨"*.

### 4.3 Carta Interna & Conteúdo
- Cartão com fundo branco perolado, bordas arredondadas e sombra suave.
- Moldura de foto ajustada proporcionalmente (`object-fit: cover`), preservando a qualidade da imagem `eu e ray.jpg`.
- Coração animado pulsando com a frase *"Eu te amo ❤️"* em destaque, utilizando tipografia romântica legível e elegante.
- Botão "Guardar cartinha" para recolher a carta e fechar o envelope.

## 5. Plano de Verificação
- Testar clique no envelope e verificar sequência da animação de abertura.
- Testar renderização da foto `eu e ray.jpg` e do coração "Eu te amo".
- Verificar geração e desempenho das partículas de corações no canvas.
- Testar fechamento e reabertura da carta.
- Testar em resoluções mobile (ex: 375px, 414px) e desktop (1080p).
