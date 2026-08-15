/**
 * ============================================================================
 * Rayane Fofinha - Cartinha de Amor Interativa ❤️
 * Lógica de Interatividade, Acessibilidade e Partículas Canvas
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Paleta de Cores Romântica para as Partículas
  // --------------------------------------------------------------------------
  const ROMANTIC_PALETTE = [
    '#ff6b8b', // Rosa Romântico
    '#e63946', // Carmesim Intenso
    '#ff477e', // Vermelho Amor / Pink Vibrante
    '#ffd166', // Dourado Suave / Brilho
    '#f72585', // Magenta / Lavanda Radiante
    '#ff85a1', // Flor de Cerejeira
    '#ffccd5'  // Rosa Pastel Iluminado
  ];

  // --------------------------------------------------------------------------
  // Configurações e Preferências de Acessibilidade
  // --------------------------------------------------------------------------
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = reducedMotionQuery.matches;

  reducedMotionQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
  });

  // --------------------------------------------------------------------------
  // Seleção de Elementos do DOM
  // --------------------------------------------------------------------------
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const envelope = document.getElementById('envelope');
  const sealBtn = document.getElementById('sealBtn');
  const closeBtn = document.getElementById('closeBtn');
  const letterCard = document.getElementById('letterCard');
  const hintText = document.getElementById('hintText');
  const canvas = document.getElementById('hearts-canvas');

  let isEnvelopeOpen = false;

  // --------------------------------------------------------------------------
  // Canvas de Partículas de Corações Flutuantes
  // --------------------------------------------------------------------------
  let ctx = null;
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  let particles = [];
  let lastTime = performance.now();
  let animationFrameId = null;
  let ambientSpawnTimer = 0;

  if (canvas && canvas.getContext) {
    ctx = canvas.getContext('2d');
  }

  /**
   * Redimensiona o canvas para preencher a tela inteira,
   * adaptando-se à densidade de pixels (Retina / High-DPI).
   */
  function resizeCanvas() {
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = Math.floor(canvasWidth * dpr);
    canvas.height = Math.floor(canvasHeight * dpr);

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  /**
   * Desenha um coração suave e elegante utilizando curvas de Bézier.
   *
   * @param {CanvasRenderingContext2D} context
   * @param {number} x - Posição horizontal central
   * @param {number} y - Posição vertical central
   * @param {number} size - Tamanho aproximado em pixels
   * @param {number} rotation - Rotação em radianos
   * @param {string} color - Cor de preenchimento CSS
   * @param {number} alpha - Opacidade (0.0 a 1.0)
   */
  function drawHeart(context, x, y, size, rotation, color, alpha) {
    if (alpha <= 0 || size <= 0) return;

    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = Math.max(0, Math.min(1, alpha));
    context.fillStyle = color;

    // Normalização da escala para a geometria de curvas
    const s = size / 24;
    context.beginPath();

    // Ponto superior central (cleft do coração)
    const topCleftY = -4 * s;
    context.moveTo(0, topCleftY);

    // Lóbulo esquerdo superior e descida até a ponta inferior
    context.bezierCurveTo(-12 * s, -16 * s, -24 * s, 0, 0, 18 * s);

    // Lóbulo direito subindo da ponta inferior até o topo
    context.bezierCurveTo(24 * s, 0, 12 * s, -16 * s, 0, topCleftY);

    context.closePath();
    context.fill();
    context.restore();
  }

  /**
   * Classe que representa uma partícula individual de coração flutuante.
   */
  class HeartParticle {
    /**
     * @param {number} x - Posição X inicial
     * @param {number} y - Posição Y inicial
     * @param {boolean} isBurst - Se originou de uma explosão comemorativa
     * @param {object} [customOptions] - Opções customizadas de velocidade e tamanho
     */
    constructor(x, y, isBurst = false, customOptions = {}) {
      this.isBurst = isBurst;
      this.x = x;
      this.y = y;

      const colorIndex = Math.floor(Math.random() * ROMANTIC_PALETTE.length);
      this.color = customOptions.color || ROMANTIC_PALETTE[colorIndex];

      const motionFactor = prefersReducedMotion ? 0.4 : 1;

      if (isBurst) {
        // Partícula de explosão: eufórica, expansiva e veloz no início
        this.size = (Math.random() * 14 + 10) * (prefersReducedMotion ? 0.8 : 1);
        const angle = customOptions.angle !== undefined
          ? customOptions.angle
          : Math.random() * Math.PI * 2;
        const speed = (Math.random() * 260 + 120) * motionFactor;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - (Math.random() * 60 + 40); // Impulso ascendente adicional
        this.drag = 0.94; // Resistência do ar gradual
        this.buoyancy = - (Math.random() * 35 + 25) * motionFactor; // Flutuação ascendente posterior

        this.rotation = (Math.random() - 0.5) * Math.PI;
        this.rotSpeed = (Math.random() - 0.5) * 4 * motionFactor;

        this.wobblePhase = Math.random() * Math.PI * 2;
        this.wobbleSpeed = (Math.random() * 2.5 + 1.5) * motionFactor;
        this.wobbleAmp = Math.random() * 20 + 8;

        this.life = 0;
        this.maxLife = Math.random() * 2.5 + 2.0; // Dura entre 2.0 e 4.5 segundos
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.35 + 0.65;
      } else {
        // Partícula ambiente: sutil, suave e relaxante subindo pela tela
        this.size = (Math.random() * 12 + 8) * (prefersReducedMotion ? 0.75 : 1);
        this.vx = (Math.random() - 0.5) * 20 * motionFactor;
        this.vy = - (Math.random() * 45 + 25) * motionFactor;
        this.drag = 1.0;
        this.buoyancy = 0;

        this.rotation = (Math.random() - 0.5) * 0.5;
        this.rotSpeed = (Math.random() - 0.5) * 0.8 * motionFactor;

        this.wobblePhase = Math.random() * Math.PI * 2;
        this.wobbleSpeed = (Math.random() * 1.8 + 0.8) * motionFactor;
        this.wobbleAmp = Math.random() * 25 + 10;

        this.life = 0;
        this.maxLife = Math.random() * 5.0 + 4.5;
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.35 + 0.35;
      }
    }

    /**
     * Atualiza a física e ciclo de vida da partícula.
     * @param {number} dt - Delta time em segundos
     * @returns {boolean} - True se a partícula continua viva
     */
    update(dt) {
      this.life += dt;
      if (this.life >= this.maxLife) return false;

      // Cálculo de Fade In / Fade Out orgânico
      const progress = this.life / this.maxLife;
      if (progress < 0.15) {
        this.alpha = (progress / 0.15) * this.maxAlpha;
      } else if (progress > 0.7) {
        this.alpha = (1 - (progress - 0.7) / 0.3) * this.maxAlpha;
      } else {
        this.alpha = this.maxAlpha;
      }

      // Aplicação de velocidades e física
      if (this.isBurst) {
        this.vx *= Math.pow(this.drag, dt * 60);
        this.vy *= Math.pow(this.drag, dt * 60);
        // Transição suave para flutuabilidade ascendente após explosão inicial
        this.vy += this.buoyancy * dt;
      }

      this.x += this.vx * dt;
      this.y += this.vy * dt;

      this.rotation += this.rotSpeed * dt;
      this.wobblePhase += this.wobbleSpeed * dt;

      // Descartar se ultrapassar o topo da tela
      if (this.y < -60 || this.x < -60 || this.x > canvasWidth + 60) {
        return false;
      }

      return true;
    }

    /**
     * Renderiza o coração no contexto 2D.
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
      const wobbleX = Math.sin(this.wobblePhase) * this.wobbleAmp;
      drawHeart(
        context,
        this.x + wobbleX,
        this.y,
        this.size,
        this.rotation,
        this.color,
        this.alpha
      );
    }
  }

  /**
   * Cria uma explosão festiva de corações em torno de uma coordenada.
   *
   * @param {number} originX - Posição X de origem
   * @param {number} originY - Posição Y de origem
   * @param {number} [count] - Quantidade de partículas
   */
  function createHeartBurst(originX, originY, count) {
    if (!ctx) return;

    const baseCount = count || (prefersReducedMotion ? 16 : 42);
    const particlesToCreate = Math.min(baseCount, 60);

    for (let i = 0; i < particlesToCreate; i++) {
      // Pequeno jitter na posição de origem para efeito mais natural
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;

      // Distribuição radial com ligeira polarização para cima
      const angle = Math.random() * Math.PI * 2;

      const particle = new HeartParticle(
        originX + offsetX,
        originY + offsetY,
        true,
        { angle }
      );
      particles.push(particle);
    }
  }

  /**
   * Gera partículas de ambiente suave na parte inferior da tela.
   */
  function spawnAmbientParticle() {
    if (!ctx) return;

    const maxAmbient = prefersReducedMotion ? 10 : 30;
    const currentAmbientCount = particles.filter(p => !p.isBurst).length;

    if (currentAmbientCount >= maxAmbient) return;

    const x = Math.random() * canvasWidth;
    const y = canvasHeight + Math.random() * 20 + 10;

    particles.push(new HeartParticle(x, y, false));
  }

  /**
   * Loop principal de animação e renderização das partículas (60 FPS via RAF).
   * @param {DOMHighResTimeStamp} timestamp
   */
  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1); // Limite máximo de dt para evitar pulos
    lastTime = timestamp;

    if (ctx) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Emissão contínua de ambiente
      ambientSpawnTimer += dt;
      const spawnInterval = prefersReducedMotion ? 0.6 : 0.22;
      if (ambientSpawnTimer >= spawnInterval) {
        ambientSpawnTimer = 0;
        spawnAmbientParticle();
      }

      // Atualização e desenho das partículas ativas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const isAlive = p.update(dt);
        if (isAlive) {
          p.draw(ctx);
        } else {
          particles.splice(i, 1);
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // --------------------------------------------------------------------------
  // Controle de Estado do Envelope (Open / Close)
  // --------------------------------------------------------------------------

  /**
   * Abre a cartinha de amor com animação e efeito de corações.
   * @param {Event} [event]
   */
  function openEnvelope(event) {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;

    // Atualiza classes CSS para disparar transições 3D e expansão
    if (envelopeWrapper) envelopeWrapper.classList.add('open');
    if (envelope) envelope.classList.add('open');
    if (letterCard) letterCard.classList.add('open');

    // Acessibilidade e ARIA
    if (sealBtn) {
      sealBtn.setAttribute('aria-expanded', 'true');
      sealBtn.setAttribute('tabindex', '-1');
    }
    if (letterCard) {
      letterCard.setAttribute('aria-hidden', 'false');
    }
    if (closeBtn) {
      closeBtn.setAttribute('tabindex', '0');
    }

    // Posição de origem da explosão de corações (centro do selo ou do envelope)
    let originX = canvasWidth / 2;
    let originY = canvasHeight / 2;

    if (sealBtn) {
      const rect = sealBtn.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    } else if (envelope) {
      const rect = envelope.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    createHeartBurst(originX, originY);

    // Foco acessível no botão de fechar após o início do desdobramento
    setTimeout(() => {
      if (isEnvelopeOpen && closeBtn) {
        closeBtn.focus({ preventScroll: true });
      }
    }, 450);
  }

  /**
   * Fecha a cartinha guardando-a no envelope.
   * @param {Event} [event]
   */
  function closeEnvelope(event) {
    if (!isEnvelopeOpen) return;
    isEnvelopeOpen = false;

    // Remove classes do estado aberto
    if (envelopeWrapper) envelopeWrapper.classList.remove('open');
    if (envelope) envelope.classList.remove('open');
    if (letterCard) letterCard.classList.remove('open');

    // Acessibilidade e ARIA
    if (sealBtn) {
      sealBtn.setAttribute('aria-expanded', 'false');
      sealBtn.setAttribute('tabindex', '0');
    }
    if (letterCard) {
      letterCard.setAttribute('aria-hidden', 'true');
    }

    // Retorna o foco para o botão do selo de cera
    setTimeout(() => {
      if (!isEnvelopeOpen && sealBtn) {
        sealBtn.focus({ preventScroll: true });
      }
    }, 300);
  }

  // --------------------------------------------------------------------------
  // Configuração dos Event Listeners
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    // Clique no selo de cera para abrir
    if (sealBtn) {
      sealBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEnvelope(e);
      });
    }

    // Clique no envelope quando fechado para abrir
    if (envelope) {
      envelope.addEventListener('click', (e) => {
        if (!isEnvelopeOpen) {
          openEnvelope(e);
        }
      });
    }

    // Evita que cliques no interior da cartinha fechem ou re-acionem o envelope
    if (letterCard) {
      letterCard.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Clique no botão de guardar cartinha para fechar
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeEnvelope(e);
      });
    }

    // Suporte a Teclado Global
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isEnvelopeOpen) {
        closeEnvelope(e);
      }
    });

    // Suporte a Teclas Enter / Espaço no Selo
    if (sealBtn) {
      sealBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEnvelope(e);
        }
      });
    }

    // Redimensionamento de Janela
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Page Visibility API para economizar bateria e GPU quando em background
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        lastTime = performance.now();
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // Inicialização da Aplicação
  // --------------------------------------------------------------------------
  function init() {
    if (canvas) {
      resizeCanvas();
      // População inicial sutil de partículas para início gracioso
      const initialCount = prefersReducedMotion ? 4 : 12;
      for (let i = 0; i < initialCount; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const p = new HeartParticle(x, y, false);
        p.life = Math.random() * p.maxLife * 0.7; // Pré-envelhecidas para visual imediato
        particles.push(p);
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    // Configura estado ARIA inicial
    if (sealBtn) sealBtn.setAttribute('aria-expanded', 'false');
    if (letterCard) letterCard.setAttribute('aria-hidden', 'true');

    setupEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
